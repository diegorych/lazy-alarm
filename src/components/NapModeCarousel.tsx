
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
      
      {/* Custom navigation arrows */}
      <CarouselPrevious className="absolute left-8 top-1/2 -translate-y-1/2 h-12 w-12 bg-transparent border-none shadow-none hover:bg-transparent" />
      <CarouselNext className="absolute right-8 top-1/2 -translate-y-1/2 h-12 w-12 bg-transparent border-none shadow-none hover:bg-transparent" />
    </Carousel>
  );
};

export default NapModeCarousel;
