
const ManifestoSection = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 bg-gradient-to-br from-gray-50 to-white">
      {/* Image at top */}
      <div className="mb-12">
        <img 
          src="/lovable-uploads/e1ec9ee1-b665-4003-b0fd-8b3e0aa2e31f.png" 
          alt="Person resting" 
          className="w-auto h-32 object-contain"
        />
      </div>
      
      {/* Text content */}
      <div className="max-w-2xl text-center space-y-6">
        <p className="text-base font-normal leading-relaxed" style={{ color: '#080908' }}>
          lazy alarm is a gentle excuse to slip away for a while. It's not here to optimize your sleep, track your rhythms, or launch you into action.
        </p>
        
        <p className="text-base font-normal leading-relaxed" style={{ color: '#080908' }}>
          This is for weekend afternoons, accidental naps, or those soft in-between moments when the world can wait (or not — we don't judge).
        </p>
        
        <p className="text-base font-normal leading-relaxed" style={{ color: '#080908' }}>
          You won't see a countdown. You won't be told how long you've slept. When it's time to wake up, we'll whisper — and if you don't feel like it, we'll go quiet and try again later. No pressure. No noise. Just a soft little pocket of time that belongs only to you.
        </p>
      </div>
    </div>
  );
};

export default ManifestoSection;
