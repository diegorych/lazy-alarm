
import { Button } from '@/components/ui/button';

interface NapScreenProps {
  isAlarmRinging: boolean;
  onStopAlarm: () => void;
}

const NapScreen = ({ isAlarmRinging, onStopAlarm }: NapScreenProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 relative overflow-hidden">
      {/* Animated Purple Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-600 to-blue-900 animate-nap-gradient" />
      
      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Nap Text */}
        <h1 className="text-3xl md:text-4xl font-light text-white mb-16 leading-relaxed max-w-md">
          Let the world keep spinning without you
        </h1>

        {/* Stop Button - Only show when alarm is ringing */}
        {isAlarmRinging && (
          <Button
            onClick={onStopAlarm}
            className="bg-white/90 text-gray-800 px-12 py-4 text-lg font-light rounded-full hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm animate-pulse"
          >
            Stop
          </Button>
        )}
      </div>

      {/* Subtle floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NapScreen;
