


interface TakeANapCardProps {
  onStartNap: () => void;
  isTransitioning?: boolean;
}

const TakeANapCard = ({ onStartNap, isTransitioning = false }: TakeANapCardProps) => {
  return (
    <div className="h-screen flex flex-col relative">
      {/* Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-8">
        <button
          onClick={onStartNap}
          className={`group relative w-52 h-52 md:w-60 md:h-60 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 ${isTransitioning ? 'animate-text-move-out' : 'animate-fade-in'}`}
          style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.95) 0%, rgba(240,238,235,0.9) 40%, rgba(210,205,200,0.85) 70%, rgba(180,175,170,0.8) 100%)',
            boxShadow: `
              0 8px 32px rgba(0,0,0,0.18),
              0 2px 8px rgba(0,0,0,0.12),
              inset 0 -4px 12px rgba(0,0,0,0.06),
              inset 0 4px 12px rgba(255,255,255,0.8),
              0 0 0 1px rgba(255,255,255,0.3)
            `,
          }}
        >
          <span className="font-wUltralight text-2xl md:text-3xl text-gray-700 leading-tight text-center block px-6">
            Take a<br />quick <span className="font-wBold">nap</span>
          </span>
        </button>
      </div>

      {/* Description at bottom */}
      <div className="absolute bottom-0 w-full pb-10 flex justify-center z-10 px-8">
        <p className={`font-tRegular font-light text-black text-center max-w-lg leading-relaxed ${isTransitioning ? 'animate-text-move-out' : 'animate-fade-in'
          }`}>
          {"A short, no-pressure nap. We won't say how long (something like 20 or 30 minutes), but it's enough to reset without ruining your day."}
        </p>
      </div>
    </div>
  );
};

export default TakeANapCard;
