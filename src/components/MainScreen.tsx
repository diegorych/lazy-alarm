
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
        
        {/* Face Icon Placeholder */}
        <div className="mb-12 w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <div className="text-4xl">😴</div>
        </div>

        {/* App Title */}
        <h1 className="text-2xl font-light text-gray-800 mb-2 tracking-wide">
          lazy alarm
        </h1>

        {/* Main Heading */}
        <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-16 text-center leading-tight">
          Take a quick nap
        </h2>

        {/* Start Button */}
        <Button
          onClick={onStartNap}
          className="bg-white/90 text-gray-800 px-12 py-4 text-lg font-light rounded-full hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm"
        >
          Start sleeping
        </Button>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-600 animate-bounce">
          <div className="w-1 h-8 bg-gray-400 rounded-full opacity-50" />
        </div>
      </div>

      {/* Manifesto Section */}
      <ManifestoSection />
    </div>
  );
};

export default MainScreen;
