import React from "react";
import PhotoBooth from "../components/PhotoBooth/PhotoBooth";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-photobooth-background">
      <div className="w-full max-w-4xl px-4 py-8 md:py-12">
        <PhotoBooth />
      </div>
    </div>
  );
};

export default Index;
