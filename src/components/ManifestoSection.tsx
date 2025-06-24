
import { useState, useEffect } from 'react';

const ManifestoSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('manifesto-section');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  return (
    <div 
      id="manifesto-section"
      className="min-h-screen flex flex-col items-center justify-center px-8 bg-gradient-to-br from-gray-50 to-white"
    >
      {/* Title */}
      <div 
        className={`mb-12 transition-all duration-1000 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: '200ms' }}
      >
        <h2 className="text-2xl md:text-2xl font-normal text-center" style={{ color: '#080908' }}>
          THIS ISN'T AN ALARM
        </h2>
      </div>
      
      {/* Text content - left aligned */}
      <div className="max-w-2xl w-full space-y-6">
        <p 
          className={`text-base font-normal leading-relaxed text-left transition-all duration-1000 ease-out ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          style={{ 
            color: '#080908',
            transitionDelay: '400ms'
          }}
        >
          lazy alarm is a gentle excuse to slip away for a while. It's not here to optimize your sleep, track your rhythms, or launch you into action.
        </p>
        
        <p 
          className={`text-base font-normal leading-relaxed text-left transition-all duration-1000 ease-out ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          style={{ 
            color: '#080908',
            transitionDelay: '600ms'
          }}
        >
          This is for weekend afternoons, accidental naps, or those soft in-between moments when the world can wait (or not — we don't judge).
        </p>
        
        <p 
          className={`text-base font-normal leading-relaxed text-left transition-all duration-1000 ease-out ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          style={{ 
            color: '#080908',
            transitionDelay: '800ms'
          }}
        >
          You won't see a countdown. You won't be told how long you've slept. When it's time to wake up, we'll whisper — and if you don't feel like it, we'll go quiet and try again later. No pressure. No noise. Just a soft little pocket of time that belongs only to you.
        </p>
      </div>

      {/* Image at bottom */}
      <div 
        className={`mt-12 transition-all duration-1000 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: '1000ms' }}
      >
        <img 
          src="/lovable-uploads/e1ec9ee1-b665-4003-b0fd-8b3e0aa2e31f.png" 
          alt="Person resting" 
          className="w-auto h-32 object-contain"
        />
      </div>
    </div>
  );
};

export default ManifestoSection;
