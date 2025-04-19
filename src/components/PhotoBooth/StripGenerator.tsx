
import React, { useEffect, useState } from "react";
import { usePhotoBooth } from "../../context/PhotoBoothContext";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home } from "lucide-react";
import { generatePhotoStrip } from "../../utils/imageUtils";
import DownloadButton from "../../utils/downloadButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StripGenerator: React.FC = () => {
  const { 
    photos, 
    stripGenerated, 
    setStripGenerated, 
    resetPhotoBooth 
  } = usePhotoBooth();
  
  const [orientation, setOrientation] = useState<"vertical" | "horizontal">("vertical");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    generateStrip();
  }, [orientation, photos]);

  const generateStrip = async () => {
    if (photos.length === 0) return;
    
    setIsGenerating(true);
    try {
      const strip = await generatePhotoStrip(photos, orientation === "vertical");
      setStripGenerated(strip);
    } catch (error) {
      console.error("Error generating strip:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getFilename = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    return `photobooth-strip-${timestamp}.png`;
  };

  const startOver = () => {
    resetPhotoBooth();
  };

  return (
    <div className="photobooth-container animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-photobooth-dark">Your PhotoBooth Strip</h1>
        <p className="text-gray-600">Choose your layout and download your memories</p>
      </div>

      <Tabs defaultValue="vertical" className="mb-6" onValueChange={(value) => setOrientation(value as "vertical" | "horizontal")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vertical">Vertical Strip</TabsTrigger>
          <TabsTrigger value="horizontal">Horizontal Strip</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col items-center justify-center">
        {isGenerating ? (
          <div className="p-10 text-center">
            <div className="animate-pulse-light text-photobooth-primary">
              <RefreshCw className="animate-spin mx-auto mb-4" size={32} />
              <p>Generating your strip...</p>
            </div>
          </div>
        ) : stripGenerated ? (
          <div className="flex flex-col items-center max-w-full overflow-hidden">
            <div className="photobooth-strip mb-6 max-w-full">
              <img 
                src={stripGenerated} 
                alt="Generated PhotoBooth Strip" 
                className="max-w-full h-auto"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <DownloadButton 
                imageData={stripGenerated}
                filename={getFilename()}
                className="rounded-full"
              />
              
              <Button
                variant="outline"
                onClick={startOver}
                className="rounded-full flex items-center gap-2"
              >
                <Home size={16} />
                Start Over
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>No images available to generate a strip.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StripGenerator;
