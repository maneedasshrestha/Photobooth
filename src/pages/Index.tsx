
import React from "react";
import PhotoBooth from "../components/PhotoBooth/PhotoBooth";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-white">
      <div className="w-full max-w-4xl px-4 py-8 md:py-12 flex-grow">
        <PhotoBooth />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
