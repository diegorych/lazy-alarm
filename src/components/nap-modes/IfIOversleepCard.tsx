
import { Button } from '@/components/ui/button';

interface IfIOversleepCardProps {
  onStartNap: () => void;
}

const IfIOversleepCard = ({ onStartNap }: IfIOversleepCardProps) => {
  return (
    <div className="min-h-screen flex flex-col px-8 relative">
      {/* Background with deep blue gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-600 via-slate-800 to-slate-900" />
      
      {/* Logo at top */}
      <div className="pt-16 flex justify-center relative z-10">
        <img src="/lovable-uploads/f9b778ca-c623-432b-bd31-3dab3ea23e93.png" alt="lazy alarm logo" className="h-16 w-auto" />
      </div>

      {/* Center block with title and button */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-normal mb-4 text-center text-white">
          If I oversleep
        </h1>
        
        <p className="font-light text-white/90 text-center max-w-lg leading-relaxed text-lg mb-12">
          Sleep as long as you need. A gentle nudge only if you've been resting for more than 2 hours.
        </p>

        <Button onClick={onStartNap} className="bg-white/90 text-gray-800 px-16 py-6 text-xl font-light rounded-full hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm">
          Start sleeping →
        </Button>
      </div>
    </div>
  );
};

export default IfIOversleepCard;
