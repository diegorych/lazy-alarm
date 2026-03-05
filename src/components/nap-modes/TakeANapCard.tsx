


interface TakeANapCardProps {
  onStartNap: () => void;
  isTransitioning?: boolean;
}

const TakeANapCard = ({ onStartNap, isTransitioning = false }: TakeANapCardProps) => {
  return (
    <div className="h-screen flex flex-col relative">
      {/* Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-8 text-white">
        <button
          onClick={onStartNap}
          className={`group relative w-64 h-64 md:w-80 md:h-80 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 ${isTransitioning ? 'animate-text-move-out' : 'animate-fade-in'}`}
          style={{
            background: 'radial-gradient(circle, rgba(240,238,235,0.95) 0%, rgba(222,218,213,0.9) 55%, rgba(190,185,180,0.9) 100%)',
            boxShadow: `
              0 8px 32px rgba(0,0,0,0.18),
              0 2px 8px rgba(0,0,0,0.12),
              inset 0 -4px 12px rgba(0,0,0,0.06),
              inset 0 4px 10px rgba(255,255,255,0.3),
              0 0 0 1px rgba(255,255,255,0.3)
            `,
          }}
        >
          <span className="text-2xl md:text-3xl font-medium leading-tight text-center block px-6 text-neutral-900">
            Take a nap
          </span>
        </button>
      </div>

      {/* Description at bottom */}
      <div className="absolute bottom-0 w-full pb-10 flex justify-center z-10 px-8">
        <p
          className={`text-base md:text-lg font-normal text-neutral-200 text-center max-w-md md:max-w-2xl leading-relaxed ${
            isTransitioning ? 'animate-text-move-out' : 'animate-fade-in'
          }`}
        >
          {"A short, no-pressure nap. We won't say how long (something like 20 or 30 minutes), but it's enough to reset without ruining your day."}
        </p>
      </div>
    </div>
  );
};

export default TakeANapCard;
