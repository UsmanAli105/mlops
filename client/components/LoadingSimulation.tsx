"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Scan, Brain, Eye, Target } from "lucide-react";
import Image from "next/image";

interface LoadingSimulationProps {
  onComplete: () => void;
  uploadedImage: string;
}

export default function LoadingSimulation({ onComplete, uploadedImage }: LoadingSimulationProps) {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [scanlinePosition, setScanlinePosition] = useState(0);
  const [scannedArea, setScannedArea] = useState(0);
  const [detectionBoxes, setDetectionBoxes] = useState<Array<{id: number, x: number, y: number, width: number, height: number, opacity: number}>>([]);

  const stages = [
    { name: "Analyzing Structure", icon: <Eye className="h-4 w-4" />, color: "blue" },
    { name: "Detecting Fields", icon: <Target className="h-4 w-4" />, color: "purple" },
    { name: "Reading Text", icon: <Scan className="h-4 w-4" />, color: "orange" },
    { name: "Processing Data", icon: <Brain className="h-4 w-4" />, color: "green" },
  ];

  useEffect(() => {
    const simulateProcessing = async () => {
      // Stage 1: Image Analysis with advanced scanning effect
      setCurrentStage(0);
      for (let i = 0; i <= 25; i++) {
        await new Promise(resolve => setTimeout(resolve, 60));
        setProgress(i);
        setScanlinePosition((i / 25) * 100);
        setScannedArea((i / 25) * 100);
      }

      // Stage 2: Object Detection with boxes appearing
      setCurrentStage(1);
      const boxes = [
        { id: 1, x: 15, y: 20, width: 30, height: 8, opacity: 0 },
        { id: 2, x: 60, y: 25, width: 35, height: 6, opacity: 0 },
        { id: 3, x: 10, y: 40, width: 40, height: 10, opacity: 0 },
        { id: 4, x: 55, y: 45, width: 30, height: 8, opacity: 0 },
        { id: 5, x: 20, y: 65, width: 45, height: 12, opacity: 0 },
        { id: 6, x: 70, y: 70, width: 25, height: 6, opacity: 0 },
      ];

      for (let i = 25; i <= 50; i++) {
        await new Promise(resolve => setTimeout(resolve, 80));
        setProgress(i);
        
        // Gradually show detection boxes
        const boxesToShow = Math.floor(((i - 25) / 25) * boxes.length);
        setDetectionBoxes(boxes.map((box, index) => ({
          ...box,
          opacity: index < boxesToShow ? 0.8 : 0
        })));
      }

      // Stage 3: Text Recognition with pulsing boxes
      setCurrentStage(2);
      for (let i = 50; i <= 80; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress(i);
        
        // Pulse effect on boxes
        const pulseIntensity = Math.sin((i - 50) * 0.3) * 0.3 + 0.8;
        setDetectionBoxes(prev => prev.map(box => ({
          ...box,
          opacity: box.opacity > 0 ? pulseIntensity : 0
        })));
      }

      // Stage 4: Data Processing
      setCurrentStage(3);
      for (let i = 80; i <= 100; i++) {
        await new Promise(resolve => setTimeout(resolve, 60));
        setProgress(i);
      }

      // Fade out effects
      setDetectionBoxes([]);
      setScanlinePosition(-10);
      setScannedArea(0);
      
      setTimeout(() => {
        onComplete();
      }, 500);
    };

    simulateProcessing();
  }, [onComplete]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Scan className="h-6 w-6 text-blue-600 animate-pulse" />
            <h2 className="text-2xl font-bold text-gray-900">AI Processing</h2>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Badge 
              variant="outline" 
              className={`
                ${currentStage === 0 ? 'border-blue-500 text-blue-600' : ''}
                ${currentStage === 1 ? 'border-purple-500 text-purple-600' : ''}
                ${currentStage === 2 ? 'border-orange-500 text-orange-600' : ''}
                ${currentStage === 3 ? 'border-green-500 text-green-600' : ''}
              `}
            >
              {stages[currentStage]?.icon}
              <span className="ml-1">{stages[currentStage]?.name}</span>
            </Badge>
          </div>
        </div>

        {/* Image with Visual Effects */}
        <div className="relative max-h-96 overflow-hidden rounded-lg border mb-4">
          <div className="relative">
            <Image
              src={uploadedImage}
              alt="Document being processed"
              width={800}
              height={600}
              className="w-full h-auto object-contain"
            />
            
            {/* Advanced Scanning Effect */}
            {currentStage === 0 && (
              <>
                {/* Base image enhancement for scanned area */}
                <div 
                  className="absolute left-0 right-0 scanned-area transition-all duration-75 ease-linear"
                  style={{ 
                    top: 0,
                    height: `${scannedArea}%`,
                  }}
                />
                
                {/* Text contrast enhancement overlay */}
                <div 
                  className="absolute left-0 right-0 pointer-events-none transition-all duration-75 ease-linear"
                  style={{ 
                    top: 0,
                    height: `${scannedArea}%`,
                    background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.08) 0%, rgba(147, 197, 253, 0.12) 50%, rgba(191, 219, 254, 0.08) 100%)',
                    mixBlendMode: 'overlay'
                  }}
                />
                
                {/* Dynamic scanning line with enhanced effects */}
                <div 
                  className="absolute left-0 right-0 transition-all duration-75 ease-linear z-10"
                  style={{ top: `${scanlinePosition}%` }}
                >
                  {/* Pre-scan glow */}
                  <div className="absolute -top-12 left-0 right-0 h-24 bg-gradient-radial from-blue-400/20 via-blue-300/10 to-transparent blur-md"></div>
                  
                  {/* Main scanning beam */}
                  <div className="relative h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-2xl shadow-blue-500/60">
                    {/* Central scanning core */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-500 rounded-full shadow-xl shadow-blue-500/60">
                      <div className="absolute inset-1 bg-gradient-to-br from-white to-blue-100 rounded-full animate-pulse">
                        <div className="absolute inset-2 bg-blue-400 rounded-full particle-float"></div>
                      </div>
                    </div>
                    
                    {/* Scanning particles */}
                    <div className="absolute -top-1 left-1/4 w-1 h-1 bg-cyan-300 rounded-full particle-float" style={{ animationDelay: '0.2s' }}></div>
                    <div className="absolute -top-1 right-1/4 w-1 h-1 bg-cyan-300 rounded-full particle-float" style={{ animationDelay: '0.4s' }}></div>
                    <div className="absolute -bottom-1 left-1/3 w-1 h-1 bg-blue-300 rounded-full particle-float" style={{ animationDelay: '0.1s' }}></div>
                    <div className="absolute -bottom-1 right-1/3 w-1 h-1 bg-blue-300 rounded-full particle-float" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                  
                  {/* Scanning trail effect */}
                  <div className="absolute -top-6 left-0 right-0 h-12 bg-gradient-to-b from-blue-400/0 via-blue-400/40 to-blue-400/0 scan-beam"></div>
                  
                  {/* Edge enhancement lines */}
                  <div className="absolute -top-2 left-0 right-0 h-4 bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent blur-sm"></div>
                  <div className="absolute -bottom-2 left-0 right-0 h-4 bg-gradient-to-r from-transparent via-blue-300/60 to-transparent blur-sm"></div>
                </div>

                {/* Text enhancement mask for better contrast */}
                <div 
                  className="absolute left-0 right-0 pointer-events-none text-enhance"
                  style={{ 
                    top: 0,
                    height: `${scannedArea}%`,
                    background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.06) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(147, 197, 253, 0.06) 100%)',
                    backdropFilter: 'contrast(1.2) brightness(0.98)'
                  }}
                />
                
                {/* Scanning progress indicator lines */}
                {scannedArea > 10 && (
                  <div className="absolute left-2 right-2 border-l-2 border-r-2 border-blue-300/50 pointer-events-none"
                       style={{ top: '5%', height: `${scannedArea - 10}%` }} />
                )}
              </>
            )}

            {/* Detection Boxes */}
            {detectionBoxes.map((box) => (
              <div
                key={box.id}
                className="absolute border-2 border-red-500 bg-red-500/10 transition-opacity duration-300"
                style={{
                  left: `${box.x}%`,
                  top: `${box.y}%`,
                  width: `${box.width}%`,
                  height: `${box.height}%`,
                  opacity: box.opacity,
                }}
              >
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
            ))}

            {/* Processing Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 pointer-events-none"></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Processing Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Stage Indicators */}
        <div className="flex justify-center space-x-4">
          {stages.map((stage, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                ${index < currentStage ? 'bg-green-500 text-white' : 
                  index === currentStage ? 'bg-blue-500 text-white animate-pulse' : 
                  'bg-gray-200 text-gray-400'}
              `}>
                {index < currentStage ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  stage.icon
                )}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${
                index <= currentStage ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {stage.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
