
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
      <div className="min-h-screen flex flex-col items-center justify-center px-8 relative">
        {/* Pink Background */}
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url('/lovable-uploads/44c9e136-bd41-461d-b9c4-ca14f8efee0f.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Logo */}
        <div className="mb-12 relative z-10">
          <img 
            src="/lovable-uploads/f9b778ca-c623-432b-bd31-3dab3ea23e93.png" 
            alt="lazy alarm logo" 
            className="h-16 w-auto"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-normal text-black mb-12 text-center relative z-10">
          Take a quick nap
        </h1>

        {/* Start Button */}
        <Button
          onClick={onStartNap}
          className="bg-white/90 text-gray-800 px-16 py-6 text-xl font-light rounded-full hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm mb-16 relative z-10"
        >
          Start sleeping →
        </Button>

        {/* Descriptive Paragraph */}
        <p className="text-lg font-light text-black text-center max-w-lg leading-relaxed relative z-10">
          A short, no-pressure nap. We won't say how long (something like 20 or 30 minutes), but it's enough to reset without ruining your day.
        </p>
      </div>

      {/* Manifesto Section */}
      <ManifestoSection />
    </div>
  );
};

export default MainScreen;
