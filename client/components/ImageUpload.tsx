"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileImage, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  onImageUpload: (file: File, imageDataUrl: string) => void;
  isProcessing: boolean;
}

export default function ImageUpload({ onImageUpload, isProcessing }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileUpload(e.dataTransfer.files[0]);
      }
    },
    [onImageUpload]
  );

  const handleFileUpload = (file: File) => {
    if (file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const imageDataUrl = reader.result as string;
        setUploadedImage(imageDataUrl);
        onImageUpload(file, imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const clearImage = () => {
    setUploadedImage(null);
    setSelectedFile(null);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Document Processing System
          </h2>
          <p className="text-gray-600">
            Upload a support call log sheet to extract structured data using AI
          </p>
        </div>

        {!uploadedImage ? (
          <div
            className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            } ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <FileImage className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <div className="space-y-2">
              <p className="text-xl font-medium text-gray-900">
                Drop your document here
              </p>
              <p className="text-gray-500">or click to browse</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isProcessing}
            />
            <Button className="mt-4" disabled={isProcessing}>
              <Upload className="mr-2 h-4 w-4" />
              Choose File
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Uploaded Document</h3>
                {!isProcessing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearImage}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
              <div className="relative max-h-96 overflow-hidden rounded-lg border">
                <Image
                  src={uploadedImage}
                  alt="Uploaded document"
                  width={800}
                  height={600}
                  className="w-full h-auto object-contain"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm font-medium">Processing...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {selectedFile && (
              <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <span>File: {selectedFile.name}</span>
                  <span>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
