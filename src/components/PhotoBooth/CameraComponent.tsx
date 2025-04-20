
import React, { useRef, useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { usePhotoBooth } from "../../context/PhotoBoothContext";
import { Button } from "@/components/ui/button";
import { Upload, ArrowLeft, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { resizeImage } from "../../utils/imageUtils";
import { useIsMobile } from "../../hooks/use-mobile";

const CameraComponent: React.FC = () => {
  const { 
    photoCount, 
    currentPhotoIndex, 
    setCurrentPhotoIndex, 
    addPhoto, 
    updatePhoto, 
    photos, 
    setStage 
  } = usePhotoBooth();
  
  const [isCapturing, setIsCapturing] = useState<boolean>(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const photoRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isCapturing) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [isCapturing]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        }
      };
      
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions or use the upload option.",
        variant: "destructive"
      });
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    setCountdown(3);
    
    const countdownInterval = setInterval(() => {
      setCountdown(prevCount => {
        if (prevCount === 1) {
          clearInterval(countdownInterval);
          takeSnapshot();
          return null;
        }
        return prevCount ? prevCount - 1 : null;
      });
    }, 1000);
  };

  const takeSnapshot = async () => {
    if (videoRef.current && photoRef.current) {
      setIsFlashing(true);
      
      const video = videoRef.current;
      const canvas = photoRef.current;
      const context = canvas.getContext("2d");
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // If on mobile, flip the image horizontally before capturing to correct the mirrored view
        if (isMobile) {
          context.translate(canvas.width, 0);
          context.scale(-1, 1);
        }
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Reset the transformation matrix if we modified it
        if (isMobile) {
          context.setTransform(1, 0, 0, 1, 0, 0);
        }
        
        const dataUrl = canvas.toDataURL("image/jpeg");
        const resizedImage = await resizeImage(dataUrl);
        setPreviewImage(resizedImage);
        setIsCapturing(false);
      }
      
      setTimeout(() => {
        setIsFlashing(false);
      }, 500);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          try {
            const resizedImage = await resizeImage(dataUrl);
            setPreviewImage(resizedImage);
            setIsCapturing(false);
          } catch (err) {
            toast({
              title: "Error",
              description: "Could not process the uploaded image.",
              variant: "destructive"
            });
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmPhoto = () => {
    if (previewImage) {
      if (currentPhotoIndex < photos.length) {
        updatePhoto(currentPhotoIndex, previewImage);
      } else {
        addPhoto(previewImage);
      }

      if (currentPhotoIndex < photoCount - 1) {
        setCurrentPhotoIndex(currentPhotoIndex + 1);
        setIsCapturing(true);
        setPreviewImage(null);
      } else {
        setStage("generate");
      }
    }
  };

  const retakePhoto = () => {
    setIsCapturing(true);
    setPreviewImage(null);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="photobooth-container animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setStage("select")}
        >
          <ArrowLeft size={24} />
        </Button>
        <div>
          <h2 className="text-xl font-semibold">
            Photo {currentPhotoIndex + 1} of {photoCount}
          </h2>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="camera-container">
        {isCapturing ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${isMobile ? "camera-mirror" : ""}`}
            />
            
            {countdown !== null && (
              <div className="camera-overlay">
                <span className="bg-black/50 text-white text-7xl font-bold rounded-full w-32 h-32 flex items-center justify-center animate-count-flash">
                  {countdown}
                </span>
              </div>
            )}
            
            <div className={`camera-flash ${isFlashing ? "flashing" : ""}`}></div>
          </>
        ) : (
          previewImage && (
            <img
              src={previewImage}
              alt="Captured preview"
              className="w-full h-full object-cover"
            />
          )
        )}
        <canvas ref={photoRef} className="hidden" />
      </div>

      <div className="camera-controls">
        {isCapturing ? (
          <>
            {isCameraActive && (
              <Button
                variant="outline"
                className="camera-button"
                onClick={capturePhoto}
                disabled={countdown !== null}
              >
                <div className="shutter-button">
                  <Camera 
                    size={24} 
                    className="text-photobooth-primary" 
                    strokeWidth={2} 
                  />
                </div>
              </Button>
            )}
            
            <Button
              variant="outline"
              className="rounded-full p-3"
              onClick={triggerFileInput}
            >
              <Upload size={20} />
              <span className="ml-2">Upload</span>
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={retakePhoto}
              className="rounded-full flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Retake
            </Button>
            
            <Button
              onClick={confirmPhoto}
              className="bg-photobooth-primary hover:bg-photobooth-primary/90 text-white rounded-full"
            >
              {currentPhotoIndex < photoCount - 1 ? "Next Photo" : "Finish"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CameraComponent;
