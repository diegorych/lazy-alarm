
import { Button } from '@/components/ui/button';

interface BeforeItGetsDarkCardProps {
  onStartNap: () => void;
  isTransitioning?: boolean;
}

const BeforeItGetsDarkCard = ({ onStartNap, isTransitioning = false }: BeforeItGetsDarkCardProps) => {
  return (
    <div className="h-screen flex flex-col relative">
      {/* Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-8">
        <h1 className={`text-4xl md:text-5xl font-ultralight mb-12 text-center text-slate-50 ${
          isTransitioning ? 'animate-text-move-out' : 'animate-fade-in'
        }`}>
          Before it gets dark
        </h1>

        <Button 
          onClick={onStartNap} 
          className={`bg-white/90 text-gray-800 px-16 py-6 text-xl font-light rounded-full hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm ${
            isTransitioning ? 'animate-text-move-out' : 'animate-fade-in'
          }`}
        >
          Start sleeping →
        </Button>
      </div>

      {/* Description at bottom */}
      <div className="pb-16 flex justify-center relative z-10 px-8">
        <p className={`font-light text-black text-center max-w-lg leading-relaxed ${
          isTransitioning ? 'animate-text-move-out' : 'animate-fade-in'
        }`} style={{ fontSize: '14px' }}>
          Rest until just before sunset. Wake up refreshed with time to enjoy the golden hour.
        </p>
      </div>
    </div>
  );
};

export default BeforeItGetsDarkCard;
