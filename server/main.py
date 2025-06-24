from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from torchvision.io import read_image
from ultralytics import YOLO
from torchvision.ops import box_iou
import torch
import os
import uuid
from typing import List
import torchvision.transforms as T
from text_recognizer.models.resnet_transformer_bank import ResnetTransformer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ CORS middleware setup (allow all)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)



DEVICE = "cpu"
BASE_MODEL_DIR = 'models'
YOLO_MODEL_PATH = os.path.join(BASE_MODEL_DIR, "v11sbest.pt")
ATM_MODEL_PATH = os.path.join(BASE_MODEL_DIR, "best_atm_model.pth")
IMAGE_HEIGHT, IMAGE_WIDTH = 256, 512
MAPPING = [
    "<B>", "<S>", "<E>", "<P>",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", 
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", 
    "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    " ", "!", '"', "#", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", ":", ";", "?"
]

# Load YOLO Model
yolo_model = YOLO(YOLO_MODEL_PATH)

# Load OCR Model
args = torch.nn.Module()  # dummy object
args.tf_layers = 2
args.tf_dim = 128
args.tf_fc_dim = 512
args.tf_nhead = 4

data_config = {
    "input_dims": (3, IMAGE_HEIGHT, IMAGE_WIDTH),
    "output_dims": (256,),
    "mapping": MAPPING,
}

ocr_model = ResnetTransformer(data_config, args)
ocr_model.load_state_dict(torch.load(ATM_MODEL_PATH, map_location=DEVICE))
ocr_model.to(DEVICE)
ocr_model.eval()

resize_transform = T.Resize((IMAGE_HEIGHT, IMAGE_WIDTH))

def calculate_iou(box1, box2):
    box1 = torch.tensor(box1).unsqueeze(0)
    box2 = torch.tensor(box2).unsqueeze(0)
    return box_iou(box1, box2).item()

def merge_overlapping_boxes(boxes, iou_threshold=0.1):
    if len(boxes) <= 1:
        return boxes

    merged = []
    used = [False] * len(boxes)

    for i, box in enumerate(boxes):
        if used[i]:
            continue
        overlapping = [box]
        used[i] = True

        for j, other in enumerate(boxes[i + 1:], i + 1):
            if not used[j] and calculate_iou(box['bbox'], other['bbox']) > iou_threshold:
                overlapping.append(other)
                used[j] = True

        if len(overlapping) > 1:
            x1 = min(b['bbox'][0] for b in overlapping)
            y1 = min(b['bbox'][1] for b in overlapping)
            x2 = max(b['bbox'][2] for b in overlapping)
            y2 = max(b['bbox'][3] for b in overlapping)
            merged.append({
                'class_id': overlapping[0]['class_id'],
                'confidence': max(b['confidence'] for b in overlapping),
                'bbox': [x1, y1, x2, y2]
            })
        else:
            merged.append(box)

    return merged

def crop_from_tensor(image_tensor, data, class_names, iou_threshold=0.1):
    C, H, W = image_tensor.shape
    predictions = data.get("predictions", [])
    class_groups = {}
    for pred in predictions:
        class_id = pred["class_id"]
        class_groups.setdefault(class_id, []).append(pred)

    crops = []

    for class_id, boxes in class_groups.items():
        merged_boxes = merge_overlapping_boxes(boxes, iou_threshold)
        for box in merged_boxes:
            x1, y1, x2, y2 = map(int, box["bbox"])
            x1, y1 = max(0, x1), max(0, y1)
            x2, y2 = min(W, x2), min(H, y2)
            if x2 > x1 and y2 > y1:
                crop = image_tensor[:, y1:y2, x1:x2]
                crops.append({
                    "class_id": class_names[box["class_id"]],
                    "confidence": box["confidence"],
                    "crop": crop
                })

    return crops


@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    try:
        # Save the uploaded image temporarily
        temp_path = f"temp_{uuid.uuid4()}.jpg"
        with open(temp_path, "wb") as f:
            f.write(await file.read())

        # Run YOLO detection
        results = yolo_model.predict(temp_path, device=DEVICE, imgsz=2016)
        image_tensor = read_image(temp_path).float() / 255.0
        os.remove(temp_path)

        # Prepare bounding box predictions
        predictions = []
        for result in results:
            for box in result.boxes:
                predictions.append({
                    "class_id": int(box.cls),
                    "confidence": float(box.conf),
                    "bbox": box.xyxy[0].tolist()  # [x1, y1, x2, y2]
                })

        # Crop image regions and run OCR
        yolo_output = crop_from_tensor(image_tensor, {"predictions": predictions}, yolo_model.names)

        response = []
        for i, item in enumerate(yolo_output):
            img_tensor = item['crop']
            resized = resize_transform(img_tensor.unsqueeze(0)).squeeze(0)
            pred_tokens = ocr_model(resized.unsqueeze(0))[0]
            pred_text = ''.join([MAPPING[idx] for idx in pred_tokens if idx not in [0, 1, 2, 3]])

            response.append({
                "class_id": item["class_id"],
                "bbox": predictions[i]["bbox"],
                "confidence": predictions[i]["confidence"],
                "text": pred_text
            })

        return JSONResponse(content={"results": response})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
