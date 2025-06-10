"use client";

import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import LoadingSimulation from "@/components/LoadingSimulation";
import DataDisplay from "@/components/DataDisplay";
import { DocumentData, UploadState } from "@/types";

export default function Home() {
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    processing: false,
    completed: false,
    error: null,
    data: null,
  });

  const [uploadedImageData, setUploadedImageData] = useState<string>("");

  // Mock data for demonstration - this will be replaced with actual ML model results
  const mockExtractedData: DocumentData = {
    branchCode: "AIBL",
    address: "Station Road",
    city: "Rawalpindi",
    model: "DM-40+",
    region: "North",
    customerRequest: "Receipt Printer",
    problemDescription: "A/R Handled Physically damaged",
    actionTaken: "C.P Replacement required",
    faultyPartHandedOver: "Yes",
    handedOverTo: "Mr. Amir Munir",
    nameOfBranchPerson: "Amir Munir",
    branchPersonDesignation: "Branch Manager",
    bankName: "MEEZAN BANK LIMITED",
    branchLocation: "Tulsa Road Branch",
  };

  const handleImageUpload = (file: File, imageDataUrl: string) => {
    setUploadedImageData(imageDataUrl);
    setUploadState({
      uploading: false,
      processing: true,
      completed: false,
      error: null,
      data: null,
    });
  };

  const handleProcessingComplete = () => {
    setUploadState({
      uploading: false,
      processing: false,
      completed: true,
      error: null,
      data: mockExtractedData,
    });
  };

  const handleStartNew = () => {
    setUploadedImageData("");
    setUploadState({
      uploading: false,
      processing: false,
      completed: false,
      error: null,
      data: null,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="container mx-auto">
        {!uploadState.processing && !uploadState.completed && (
          <ImageUpload
            onImageUpload={handleImageUpload}
            isProcessing={uploadState.processing}
          />
        )}

        {uploadState.processing && (
          <LoadingSimulation 
            onComplete={handleProcessingComplete} 
            uploadedImage={uploadedImageData}
          />
        )}

        {uploadState.completed && uploadState.data && (
          <DataDisplay data={uploadState.data} onStartNew={handleStartNew} />
        )}
      </div>
    </div>
  );
}
