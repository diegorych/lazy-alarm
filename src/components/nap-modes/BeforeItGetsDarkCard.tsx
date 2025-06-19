
import { Button } from '@/components/ui/button';

interface BeforeItGetsDarkCardProps {
  onStartNap: () => void;
}

const BeforeItGetsDarkCard = ({ onStartNap }: BeforeItGetsDarkCardProps) => {
  return (
    <div className="min-h-screen flex flex-col px-8 relative">
      {/* Background with sunset gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-300 via-rose-400 to-purple-600" />
      
      {/* Logo at top */}
      <div className="pt-16 flex justify-center relative z-10">
        <img src="/lovable-uploads/f9b778ca-c623-432b-bd31-3dab3ea23e93.png" alt="lazy alarm logo" className="h-16 w-auto" />
      </div>

      {/* Center block with title and button */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-normal mb-4 text-center text-white">
          Before it gets dark
        </h1>
        
        <p className="font-light text-white/90 text-center max-w-lg leading-relaxed text-lg mb-12">
          Rest until just before sunset. Wake up refreshed with time to enjoy the golden hour.
        </p>

        <Button onClick={onStartNap} className="bg-white/90 text-gray-800 px-16 py-6 text-xl font-light rounded-full hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm">
          Start sleeping →
        </Button>
      </div>
    </div>
  );
};

export default BeforeItGetsDarkCard;
