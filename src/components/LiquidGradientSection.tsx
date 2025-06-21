
import React from 'react';

const LiquidGradientSection = () => {
  return (
    <div className="liquid-gradient-container">
      <div className="liquid-gradient-bg">
        <div className="gradient-blob blob-1"></div>
        <div className="gradient-blob blob-2"></div>
        <div className="gradient-blob blob-3"></div>
        <div className="gradient-blob blob-4"></div>
      </div>
      
      <div className="content-overlay">
        <h1 className="text-4xl md:text-6xl font-light text-white text-center">
          Flowing Dreams
        </h1>
        <p className="text-lg md:text-xl text-white/80 text-center mt-6 max-w-2xl">
          Let yourself drift into the gentle embrace of color and movement
        </p>
      </div>
    </div>
  );
};

export default LiquidGradientSection;
