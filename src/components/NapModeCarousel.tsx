import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import TakeANapCard from "./nap-modes/TakeANapCard";
import BeforeItGetsDarkCard from "./nap-modes/BeforeItGetsDarkCard";
import IfIOversleepCard from "./nap-modes/IfIOversleepCard";
import LiquidGradientSection from "./LiquidGradientSection";

export type NapMode = 'quick-nap' | 'before-dark' | 'if-oversleep';

interface NapModeCarouselProps {
  onStartNap: (mode: NapMode) => void;
  isTransitioning?: boolean;
}

const NapModeCarousel = ({ onStartNap, isTransitioning = false }: NapModeCarouselProps) => {
  return (
    <div className="w-full h-screen relative">
      {/* Animated Liquid Gradient Background */}
      <LiquidGradientSection />
      
      {/* Fixed Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2 z-20">
        <img src="/lovable-uploads/f9b778ca-c623-432b-bd31-3dab3ea23e93.png" alt="lazy alarm logo" className="h-16 w-auto" />
      </div>

      <Carousel 
        className="w-full h-screen relative z-10"
        opts={{
          loop: true
        }}
      >
        <CarouselContent className="h-screen">
          <CarouselItem className="h-screen">
            <TakeANapCard onStartNap={() => onStartNap('quick-nap')} isTransitioning={isTransitioning} />
          </CarouselItem>
          <CarouselItem className="h-screen">
            <BeforeItGetsDarkCard onStartNap={() => onStartNap('before-dark')} isTransitioning={isTransitioning} />
          </CarouselItem>
          <CarouselItem className="h-screen">
            <IfIOversleepCard onStartNap={() => onStartNap('if-oversleep')} isTransitioning={isTransitioning} />
          </CarouselItem>
        </CarouselContent>
        
        {/* Navigation arrows */}
        <CarouselPrevious className="absolute left-8 top-1/2 -translate-y-1/2 h-14 w-14 bg-white/20 border-none shadow-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm rounded-full" />
        <CarouselNext className="absolute right-8 top-1/2 -translate-y-1/2 h-14 w-14 bg-white/20 border-none shadow-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm rounded-full" />
      </Carousel>
    </div>
  );
};

export default NapModeCarousel;
