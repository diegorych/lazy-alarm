
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import TakeANapCard from '@/components/nap-modes/TakeANapCard';
import BeforeItGetsDarkCard from '@/components/nap-modes/BeforeItGetsDarkCard';
import IfIOversleepCard from '@/components/nap-modes/IfIOversleepCard';

export type NapMode = 'quick-nap' | 'before-dark' | 'if-oversleep';

interface NapModeCarouselProps {
  onStartNap: (mode: NapMode) => void;
  isTransitioning?: boolean;
}

const NapModeCarousel = ({ onStartNap, isTransitioning = false }: NapModeCarouselProps) => {
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollDirection, setLastScrollDirection] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY > scrollY ? 'down' : 'up';
      
      setScrollY(currentScrollY);
      setLastScrollDirection(scrollDirection);

      // Auto-scroll to manifesto section if user scrolls down minimally from the top
      if (currentScrollY > 50 && currentScrollY < window.innerHeight / 2 && scrollDirection === 'down' && lastScrollDirection !== 'up') {
        window.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth'
        });
      }
      // Auto-scroll back to main screen if user scrolls up from manifesto
      else if (currentScrollY > window.innerHeight / 2 && currentScrollY < window.innerHeight + 50 && scrollDirection === 'up') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY, lastScrollDirection]);

  // Calculate background opacity based on scroll position
  const backgroundOpacity = Math.max(0, 1 - (scrollY / window.innerHeight));

  return (
    <div className="min-h-screen flex flex-col px-8 relative">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out"
        style={{ opacity: backgroundOpacity }}
      >
        <source src="/path-to-your-video.mp4" type="video/mp4" />
        {/* Fallback to image if video doesn't load */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url('/lovable-uploads/44c9e136-bd41-461d-b9c4-ca14f8efee0f.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      </video>
      
      {/* Overlay to ensure smooth color transitions */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-pink-200/20 to-purple-200/20 transition-opacity duration-700 ease-out" 
        style={{ opacity: backgroundOpacity * 0.3 }}
      />
      
      {/* Logo at top */}
      <div className="pt-16 flex justify-center relative z-10">
        <img src="/lovable-uploads/f9b778ca-c623-432b-bd31-3dab3ea23e93.png" alt="lazy alarm logo" className="h-16 w-auto" />
      </div>

      {/* Center block with carousel */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="w-full max-w-sm">
          <Carousel className="w-full">
            <CarouselContent>
              <CarouselItem>
                <TakeANapCard onStartNap={() => onStartNap('quick-nap')} isTransitioning={isTransitioning} />
              </CarouselItem>
              <CarouselItem>
                <BeforeItGetsDarkCard onStartNap={() => onStartNap('before-dark')} isTransitioning={isTransitioning} />
              </CarouselItem>
              <CarouselItem>
                <IfIOversleepCard onStartNap={() => onStartNap('if-oversleep')} isTransitioning={isTransitioning} />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      </div>

      {/* Paragraph at bottom */}
      <div className="pb-16 flex justify-center relative z-10">
        <p className="font-light text-black text-center max-w-lg leading-relaxed text-sm">
          A short, no-pressure nap. We won't say how long (something like 20 or 30 minutes), but it's enough to reset without ruining your day.
        </p>
      </div>
    </div>
  );
};

export default NapModeCarousel;
