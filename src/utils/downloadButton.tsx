
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Check } from "lucide-react";
import { downloadImage } from "./imageUtils";

interface DownloadButtonProps {
  imageData: string;
  filename?: string;
  className?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  imageData,
  filename = "photobooth-strip.png",
  className = "",
}) => {
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleDownload = () => {
    if (imageData) {
      downloadImage(imageData, filename);
      setIsDownloaded(true);
      
      // Reset the downloaded state after 2 seconds
      setTimeout(() => {
        setIsDownloaded(false);
      }, 2000);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      className={`${className} ${
        isDownloaded
          ? "bg-green-600 hover:bg-green-700"
          : "bg-photobooth-primary hover:bg-photobooth-primary/90"
      } text-white rounded-full flex items-center gap-2 transition-colors`}
    >
      {isDownloaded ? (
        <>
          <Check size={16} />
          Downloaded!
        </>
      ) : (
        <>
          <Download size={16} />
          Download as PNG
        </>
      )}
    </Button>
  );
};

export default DownloadButton;
