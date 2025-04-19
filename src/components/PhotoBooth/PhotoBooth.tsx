
import React from "react";
import { PhotoBoothProvider } from "../../context/PhotoBoothContext";
import PhotoBoothContent from "./PhotoBoothContent";

const PhotoBooth: React.FC = () => {
  return (
    <PhotoBoothProvider>
      <PhotoBoothContent />
    </PhotoBoothProvider>
  );
};

export default PhotoBooth;
