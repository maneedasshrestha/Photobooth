
import React from "react";
import { usePhotoBooth } from "../../context/PhotoBoothContext";
import SelectionPage from "./SelectionPage";
import CameraComponent from "./CameraComponent";
import StripGenerator from "./StripGenerator";

const PhotoBoothContent: React.FC = () => {
  const { stage } = usePhotoBooth();

  return (
    <div className="min-h-[600px] py-4">
      {stage === "select" && <SelectionPage />}
      {stage === "capture" && <CameraComponent />}
      {stage === "generate" && <StripGenerator />}
    </div>
  );
};

export default PhotoBoothContent;
