
import React from "react";
import { usePhotoBooth } from "../../context/PhotoBoothContext";
import { Button } from "@/components/ui/button";
import { Camera, Image, ChevronRight } from "lucide-react";

const SelectionPage: React.FC = () => {
  const { setPhotoCount, setStage } = usePhotoBooth();
  const [selectedCount, setSelectedCount] = React.useState<number>(0);

  const handleSelect = (count: number) => {
    setSelectedCount(count);
  };

  const handleContinue = () => {
    if (selectedCount > 0) {
      setPhotoCount(selectedCount);
      setStage("capture");
    }
  };

  return (
    <div className="photobooth-container animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-photobooth-dark mb-2">
          PhotoBooth
        </h1>
        <p className="text-gray-600 max-w-lg mx-auto">
          Select how many photos you'd like in your photobooth strip
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[2, 3, 4].map((count) => (
          <button
            key={count}
            className={`photo-select-button ${
              selectedCount === count ? "active" : ""
            }`}
            onClick={() => handleSelect(count)}
          >
            <div className="text-4xl font-bold text-photobooth-primary mb-2">
              {count}
            </div>
            <div className="text-gray-600">Photos</div>
            <div className="flex flex-col gap-1 mt-4">
              {Array.from({ length: count }).map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-200 w-16 h-12 rounded-sm border border-gray-300"
                ></div>
              ))}
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleContinue}
          disabled={selectedCount === 0}
          className={`bg-photobooth-primary hover:bg-photobooth-primary/90 text-white px-6 py-2 rounded-full flex items-center gap-2 ${
            selectedCount === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Continue
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
};

export default SelectionPage;
