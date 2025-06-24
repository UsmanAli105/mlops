# FS FieldSense AI Backend 

This FastAPI application combines YOLO object detection with a custom OCR model (ResNet + Transformer) to extract text from detected regions in an uploaded image.

## 🚀 Features

- 🔍 Object detection using YOLO 
- 🧠 OCR using a ResNet + Transformer model 
- 📦 FastAPI backend with CORS support
- 🖼️ Upload an image and get detected regions + extracted text
- 🔁 Merges overlapping bounding boxes using IoU


## 📥 Download Pretrained Models

Before running the app, make sure the following models are downloaded and placed in the `models/` directory:

All model files can be downloaded from this shared Google Drive folder:

👉 [Download Models Folder](https://drive.google.com/drive/folders/19Nf7hpAKAcoQYuVN3mRLf6EGsyVGbUnF?usp=sharing)

| Model Type              | File Name            |
|-------------------------|----------------------|
| YOLOv8 Detection Model  | `v11sbest.pt`        |
| OCR ResNet-Transformer  | `best_atm_model.pth` |

### 📁 How to Download and Setup

1. Click the links above to download the model files.
2. Create a folder named `models/` in the root of the project if it doesn’t exist.
3. Place the downloaded files inside the `models/` folder.

Your project directory should look like this:

## 📁 Directory Structure

```
.
├── main.py                  # FastAPI app entry point
├── Dockerfile               # Docker build file
├── requirements.txt         # Python dependencies
├── models/                  # Contains .pt and .pth model files
├── text_recognizer/         # OCR model code
├── .gitignore               # Ignored files/folders
└── __pycache__/             # Python cache (ignored)
```

## 🛠️ Requirements

Install dependencies with:

```bash
# Create virtual environment
python -m venv .env

# Activate virtual environment
# For Windows:
.env\Scripts\activate
# For macOS/Linux:
source .env/bin/activate

# Upgrade pip
pip install --upgrade "pip==22.*"

# Install required packages
pip install -r requirements.txt
```

Ensure you place the following files in the `models/` directory:

- `v11sbest.pt` — YOLO model for object detection
- `best_atm_model.pth` — OCR model

## 🧪 Run Locally

```bash
uvicorn main:app --reload
```

Then access: [http://localhost:8000/docs](http://localhost:8000/docs) for Swagger UI.

## 🐳 Docker Usage

To build and run the app with Docker:

```bash
docker build -t ocr-yolo-app .
docker run -p 8000:8000 ocr-yolo-app
```

## 📬 API Endpoint

### POST `/analyze`

Upload an image and receive text predictions for detected regions.

**Body**: `multipart/form-data` with image file

**Response**:
```json
{
  "results": [
    {
      "class_id": "Text",
      "bbox": [x1, y1, x2, y2],
      "confidence": 0.91,
      "text": "AB123456"
    },
    ...
  ]
}
```

## 🔒 Notes

- CORS is enabled for all origins by default
- The app currently runs on CPU

---

**Author:** MSDS 23 Batch  
**License:** ITU