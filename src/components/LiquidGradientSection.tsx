
import { useEffect, useRef } from 'react';

const LiquidGradientSection = () => {
  const noiseCanvasRef = useRef<HTMLCanvasElement>(null);

  // Generate noise texture once
  useEffect(() => {
    const canvas = noiseCanvasRef.current;
    if (!canvas) return;
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.createImageData(256, 256);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 255;
      imageData.data[i] = v;
      imageData.data[i + 1] = v;
      imageData.data[i + 2] = v;
      imageData.data[i + 3] = 30; // subtle noise
    }
    ctx.putImageData(imageData, 0, 0);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base warm gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(160deg, #FFF5EE 0%, #FFE8D6 20%, #FFDAC1 40%, #FFD4B8 60%, #FFF0E5 100%)',
        }}
      />

      {/* Blob 1 - Large coral/orange, top-right */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '130vw',
          height: '130vw',
          maxWidth: '900px',
          maxHeight: '900px',
          top: '-15%',
          right: '-25%',
          background: 'radial-gradient(circle, #F4845F 0%, #F27059 30%, #E8654A 60%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'home-blob-1 22s ease-in-out infinite',
        }}
      />

      {/* Blob 2 - Golden yellow, center-right */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '90vw',
          height: '90vw',
          maxWidth: '650px',
          maxHeight: '650px',
          top: '10%',
          right: '-5%',
          background: 'radial-gradient(circle, #F5C26B 0%, #F0B254 30%, #EDA340 50%, transparent 70%)',
          filter: 'blur(55px)',
          animation: 'home-blob-2 26s ease-in-out infinite',
        }}
      />

      {/* Blob 3 - Pink/lavender, center-left */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '100vw',
          height: '100vw',
          maxWidth: '700px',
          maxHeight: '700px',
          bottom: '5%',
          left: '-15%',
          background: 'radial-gradient(circle, #E8A0BF 0%, #D4839F 25%, #C97BAF 50%, transparent 70%)',
          filter: 'blur(65px)',
          animation: 'home-blob-3 20s ease-in-out infinite',
        }}
      />

      {/* Blob 4 - Deep coral, bottom-right */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '80vw',
          height: '80vw',
          maxWidth: '600px',
          maxHeight: '600px',
          bottom: '-10%',
          right: '-10%',
          background: 'radial-gradient(circle, #F27059 0%, #E85D45 30%, #D94F3B 50%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'home-blob-4 24s ease-in-out infinite',
        }}
      />

      {/* Blob 5 - Warm peach/salmon overlay, center */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '70vw',
          height: '70vw',
          maxWidth: '500px',
          maxHeight: '500px',
          top: '30%',
          left: '20%',
          background: 'radial-gradient(circle, #FFBE9F 0%, #FFA882 40%, transparent 70%)',
          filter: 'blur(50px)',
          opacity: 0.8,
          animation: 'home-blob-5 18s ease-in-out infinite',
        }}
      />

      {/* Noise texture overlay */}
      <canvas
        ref={noiseCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-60 mix-blend-overlay"
        style={{ imageRendering: 'pixelated' }}
      />

      <style>{`
        @keyframes home-blob-1 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          25% { transform: translate(-5%, 8%) scale(1.08) rotate(45deg); border-radius: 40% 60% 70% 30% / 50% 60% 30% 60%; }
          50% { transform: translate(3%, -5%) scale(0.95) rotate(90deg); border-radius: 50% 30% 60% 40% / 40% 70% 40% 60%; }
          75% { transform: translate(-8%, 3%) scale(1.05) rotate(135deg); border-radius: 70% 50% 40% 30% / 30% 50% 70% 30%; }
        }
        @keyframes home-blob-2 {
          0%, 100% { transform: translate(0, 0) scale(1); border-radius: 50% 50% 40% 60% / 60% 40% 60% 40%; }
          33% { transform: translate(-10%, 6%) scale(1.1); border-radius: 40% 60% 50% 50% / 50% 50% 60% 40%; }
          66% { transform: translate(5%, -8%) scale(0.92); border-radius: 60% 40% 60% 40% / 40% 60% 40% 60%; }
        }
        @keyframes home-blob-3 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); border-radius: 55% 45% 50% 50% / 50% 55% 45% 50%; }
          30% { transform: translate(8%, -5%) scale(1.12) rotate(-30deg); border-radius: 45% 55% 40% 60% / 60% 40% 55% 45%; }
          60% { transform: translate(-3%, 10%) scale(0.9) rotate(20deg); border-radius: 50% 50% 55% 45% / 45% 55% 50% 50%; }
        }
        @keyframes home-blob-4 {
          0%, 100% { transform: translate(0, 0) scale(1); border-radius: 45% 55% 60% 40% / 55% 45% 50% 50%; }
          40% { transform: translate(-6%, -8%) scale(1.06); border-radius: 55% 45% 50% 50% / 45% 55% 40% 60%; }
          70% { transform: translate(7%, 4%) scale(0.94); border-radius: 50% 50% 45% 55% / 50% 50% 55% 45%; }
        }
        @keyframes home-blob-5 {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          50% { transform: translate(5%, -6%) scale(1.1) rotate(40deg); }
        }
      `}</style>
    </div>
  );
};

export default LiquidGradientSection;
