
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ManifestoSection from '@/components/ManifestoSection';

interface MainScreenProps {
  onStartNap: () => void;
}

const MainScreen = ({ onStartNap }: MainScreenProps) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      {/* Main Screen */}
      <div className="min-h-screen flex flex-col items-center justify-center px-8 relative overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-orange-200 to-pink-300 animate-gradient-shift" />
        
        {/* Face Icon */}
        <div className="mb-16 w-32 h-32 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
          <svg width="60" height="60" viewBox="0 0 100 100" className="text-gray-700">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
            <circle cx="35" cy="40" r="3" fill="currentColor"/>
            <circle cx="65" cy="40" r="3" fill="currentColor"/>
            <path d="M 30 65 Q 50 75 70 65" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>

        {/* App Title */}
        <h1 className="text-5xl md:text-6xl font-light text-gray-800 mb-8 tracking-wide text-center">
          lazy alarm
        </h1>

        {/* Start Button */}
        <Button
          onClick={onStartNap}
          className="bg-white/90 text-gray-800 px-16 py-6 text-xl font-light rounded-full hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm mb-16"
        >
          Start sleeping →
        </Button>

        {/* Descriptive Paragraph */}
        <p className="text-lg font-light text-gray-700 text-center max-w-md leading-relaxed">
          A gentle excuse to drift off without pressure. No timers, no guilt, no optimization. Just rest when you need it most.
        </p>
      </div>

      {/* Manifesto Section */}
      <ManifestoSection />
    </div>
  );
};

export default MainScreen;
