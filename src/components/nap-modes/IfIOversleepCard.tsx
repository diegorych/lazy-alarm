
import { Button } from '@/components/ui/button';

interface IfIOversleepCardProps {
  onStartNap: () => void;
  isTransitioning?: boolean;
}

const IfIOversleepCard = ({ onStartNap, isTransitioning = false }: IfIOversleepCardProps) => {
  return (
    <div className="h-screen flex flex-col relative">
      {/* Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-8">
        <h1 className={`text-4xl md:text-5xl font-normal mb-12 text-center text-slate-50 ${
          isTransitioning ? 'animate-text-move-out' : 'animate-fade-in'
        }`}>
          If I oversleep
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
          Sleep as long as you need. A gentle nudge only if you've been resting for more than 2 hours.
        </p>
      </div>
    </div>
  );
};

export default IfIOversleepCard;
