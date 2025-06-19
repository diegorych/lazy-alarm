
import {
  Carousel,
  CarouselContent,
  CarouselItem,
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
    <Carousel className="w-full h-screen">
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
    </Carousel>
  );
};

export default NapModeCarousel;
