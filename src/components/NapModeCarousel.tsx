
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

export type NapMode = 'quick-nap' | 'before-dark' | 'if-oversleep';

interface NapModeCarouselProps {
  onStartNap: (mode: NapMode) => void;
}

const NapModeCarousel = ({ onStartNap }: NapModeCarouselProps) => {
  return (
    <Carousel className="w-full h-screen relative">
      <CarouselContent className="h-screen">
        <CarouselItem className="h-screen">
          <TakeANapCard onStartNap={() => onStartNap('quick-nap')} />
        </CarouselItem>
        <CarouselItem className="h-screen">
          <BeforeItGetsDarkCard onStartNap={() => onStartNap('before-dark')} />
        </CarouselItem>
        <CarouselItem className="h-screen">
          <IfIOversleepCard onStartNap={() => onStartNap('if-oversleep')} />
        </CarouselItem>
      </CarouselContent>
      
      {/* Custom navigation arrows with white circle background */}
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-14 w-14 bg-white/20 border-none shadow-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-14 w-14 bg-white/20 border-none shadow-lg hover:bg-white/30 transition-all duration-200 backdrop-blur-sm" />
    </Carousel>
  );
};

export default NapModeCarousel;
