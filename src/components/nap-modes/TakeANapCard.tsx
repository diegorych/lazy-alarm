
import { Button } from '@/components/ui/button';

interface TakeANapCardProps {
  onStartNap: () => void;
}

const TakeANapCard = ({ onStartNap }: TakeANapCardProps) => {
  return (
    <div className="min-h-screen flex flex-col px-8 relative">
      {/* Fixed Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/lovable-uploads/44c9e136-bd41-461d-b9c4-ca14f8efee0f.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Fixed Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-200/20 to-purple-200/20" />
      
      {/* Fixed Logo at top */}
      <div className="pt-16 flex justify-center relative z-10">
        <img src="/lovable-uploads/f9b778ca-c623-432b-bd31-3dab3ea23e93.png" alt="lazy alarm logo" className="h-16 w-auto" />
      </div>

      {/* Animated Center Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-normal mb-12 text-center text-slate-50 animate-fade-in">
          Take a quick nap
        </h1>

        <Button onClick={onStartNap} className="bg-white/90 text-gray-800 px-16 py-6 text-xl font-light rounded-full hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm animate-fade-in">
          Start sleeping →
        </Button>
      </div>

      {/* Animated Description at bottom */}
      <div className="pb-16 flex justify-center relative z-10">
        <p className="font-light text-black text-center max-w-lg leading-relaxed text-lg animate-fade-in">
          A short, no-pressure nap. We won't say how long (something like 20 or 30 minutes), but it's enough to reset without ruining your day.
        </p>
      </div>
    </div>
  );
};

export default TakeANapCard;
