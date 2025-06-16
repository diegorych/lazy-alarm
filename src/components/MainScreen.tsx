
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ManifestoSection from '@/components/ManifestoSection';

interface MainScreenProps {
  onStartNap: () => void;
}

const MainScreen = ({
  onStartNap
}: MainScreenProps) => {
  const [scrollY, setScrollY] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const backgroundImages = [
    '/lovable-uploads/44c9e136-bd41-461d-b9c4-ca14f8efee0f.png',
    '/lovable-uploads/62ff2608-7968-40a9-9eeb-d737a47dab8c.png',
    '/lovable-uploads/d2ff6dff-bb07-40e5-b412-d9241903662b.png'
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Auto-scroll to manifesto section if user scrolls down minimally
      if (currentScrollY > 50 && currentScrollY < window.innerHeight / 2) {
        window.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth'
        });
      }
      // Auto-scroll back to main screen if user scrolls up from manifesto
      else if (currentScrollY > window.innerHeight / 2 && currentScrollY < window.innerHeight + 50) {
        const scrollDirection = currentScrollY - scrollY;
        if (scrollDirection < 0) { // scrolling up
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY]);

  // Image transition effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 2300); // 1500ms transition + 800ms delay

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Main Screen */}
      <div className="min-h-screen flex flex-col px-8 relative">
        {/* Animated Background Images */}
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-linear ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url('${image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              transitionDelay: index === currentImageIndex ? '800ms' : '0ms'
            }}
          />
        ))}
        
        {/* Logo at top */}
        <div className="pt-16 flex justify-center relative z-10">
          <img src="/lovable-uploads/f9b778ca-c623-432b-bd31-3dab3ea23e93.png" alt="lazy alarm logo" className="h-16 w-auto" />
        </div>

        {/* Center block with title and button */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-normal mb-12 text-center text-slate-50">
            Take a quick nap
          </h1>

          <Button onClick={onStartNap} className="bg-white/90 text-gray-800 px-16 py-6 text-xl font-light rounded-full hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm">
            Start sleeping →
          </Button>
        </div>

        {/* Paragraph at bottom */}
        <div className="pb-16 flex justify-center relative z-10">
          <p className="font-light text-black text-center max-w-lg leading-relaxed text-sm">
            A short, no-pressure nap. We won't say how long (something like 20 or 30 minutes), but it's enough to reset without ruining your day.
          </p>
        </div>
      </div>

      {/* Manifesto Section */}
      <ManifestoSection />
    </div>
  );
};

export default MainScreen;
