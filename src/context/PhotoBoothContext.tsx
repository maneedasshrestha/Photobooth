
import React, { createContext, useContext, useState, ReactNode } from "react";

export type PhotoBoothStage = "select" | "capture" | "preview" | "generate";

interface PhotoBoothContextType {
  photoCount: number;
  setPhotoCount: (count: number) => void;
  photos: string[];
  addPhoto: (photo: string) => void;
  updatePhoto: (index: number, photo: string) => void;
  currentPhotoIndex: number;
  setCurrentPhotoIndex: (index: number) => void;
  stage: PhotoBoothStage;
  setStage: (stage: PhotoBoothStage) => void;
  stripGenerated: string;
  setStripGenerated: (url: string) => void;
  resetPhotoBooth: () => void;
}

const PhotoBoothContext = createContext<PhotoBoothContextType | undefined>(undefined);

export const usePhotoBooth = (): PhotoBoothContextType => {
  const context = useContext(PhotoBoothContext);
  if (!context) {
    throw new Error("usePhotoBooth must be used within a PhotoBoothProvider");
  }
  return context;
};

interface PhotoBoothProviderProps {
  children: ReactNode;
}

export const PhotoBoothProvider: React.FC<PhotoBoothProviderProps> = ({ children }) => {
  const [photoCount, setPhotoCount] = useState<number>(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
  const [stage, setStage] = useState<PhotoBoothStage>("select");
  const [stripGenerated, setStripGenerated] = useState<string>("");

  const addPhoto = (photo: string) => {
    setPhotos((prev) => [...prev, photo]);
  };

  const updatePhoto = (index: number, photo: string) => {
    setPhotos((prev) => {
      const newPhotos = [...prev];
      newPhotos[index] = photo;
      return newPhotos;
    });
  };

  const resetPhotoBooth = () => {
    setPhotoCount(0);
    setPhotos([]);
    setCurrentPhotoIndex(0);
    setStage("select");
    setStripGenerated("");
  };

  return (
    <PhotoBoothContext.Provider
      value={{
        photoCount,
        setPhotoCount,
        photos,
        addPhoto,
        updatePhoto,
        currentPhotoIndex,
        setCurrentPhotoIndex,
        stage,
        setStage,
        stripGenerated,
        setStripGenerated,
        resetPhotoBooth,
      }}
    >
      {children}
    </PhotoBoothContext.Provider>
  );
};
