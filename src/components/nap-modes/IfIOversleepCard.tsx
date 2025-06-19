
import { Button } from '@/components/ui/button';

interface IfIOversleepCardProps {
  onStartNap: () => void;
}

const IfIOversleepCard = ({ onStartNap }: IfIOversleepCardProps) => {
  return (
    <div className="min-h-screen flex flex-col px-8 relative">
      {/* Fixed Background with deep blue gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-600 via-slate-800 to-slate-900" />
      
      {/* Fixed Logo at top */}
      <div className="pt-16 flex justify-center relative z-10">
        <img src="/lovable-uploads/f9b778ca-c623-432b-bd31-3dab3ea23e93.png" alt="lazy alarm logo" className="h-16 w-auto" />
      </div>

      {/* Animated Center Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-normal mb-12 text-center text-white animate-fade-in">
          If I oversleep
        </h1>

        <Button onClick={onStartNap} className="bg-white/90 text-gray-800 px-16 py-6 text-xl font-light rounded-full hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm animate-fade-in">
          Start sleeping →
        </Button>
      </div>

      {/* Animated Description at bottom */}
      <div className="pb-16 flex justify-center relative z-10">
        <p className="font-light text-black text-center max-w-lg leading-relaxed text-lg animate-fade-in">
          Sleep as long as you need. A gentle nudge only if you've been resting for more than 2 hours.
        </p>
      </div>
    </div>
  );
};

export default IfIOversleepCard;
