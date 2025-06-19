
import { Button } from '@/components/ui/button';

interface TakeANapCardProps {
  onStartNap: () => void;
}

const TakeANapCard = ({ onStartNap }: TakeANapCardProps) => {
  return (
    <div className="min-h-screen flex flex-col px-8 relative">
      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/lovable-uploads/44c9e136-bd41-461d-b9c4-ca14f8efee0f.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-200/20 to-purple-200/20" />
      
      {/* Logo at top */}
      <div className="pt-16 flex justify-center relative z-10">
        <img src="/lovable-uploads/f9b778ca-c623-432b-bd31-3dab3ea23e93.png" alt="lazy alarm logo" className="h-16 w-auto" />
      </div>

      {/* Center block with title and button */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-normal mb-4 text-center text-slate-50">
          Take a quick nap
        </h1>
        
        <p className="font-light text-white/80 text-center max-w-lg leading-relaxed text-lg mb-12">
          A short, no-pressure nap. Something like 20 or 30 minutes to reset without ruining your day.
        </p>

        <Button onClick={onStartNap} className="bg-white/90 text-gray-800 px-16 py-6 text-xl font-light rounded-full hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm">
          Start sleeping →
        </Button>
      </div>
    </div>
  );
};

export default TakeANapCard;
