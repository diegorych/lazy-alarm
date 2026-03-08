import { Settings } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

interface NapSettingsProps {
  napDuration: number;
  onNapDurationChange: (minutes: number) => void;
  autoStopAlarm: boolean;
  onAutoStopAlarmChange: (enabled: boolean) => void;
}

const NapSettings = ({
  napDuration,
  onNapDurationChange,
  autoStopAlarm,
  onAutoStopAlarmChange,
}: NapSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-10 right-6 z-30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 ${
          isOpen
            ? 'bg-white/20 text-white border border-white/30'
            : 'bg-white/[0.06] text-white/50 border border-white/[0.08] hover:bg-white/10 hover:text-white/70'
        }`}
      >
        <Settings size={16} />
      </button>

      {isOpen && (
        <div
          className="absolute top-12 right-0 w-72 rounded-2xl border border-white/[0.1] p-5 space-y-6 animate-fade-in"
          style={{
            background: 'rgba(10, 10, 12, 0.85)',
            WebkitBackdropFilter: 'blur(40px)',
            backdropFilter: 'blur(40px) saturate(1.4)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0.5px 0.5px rgba(255,255,255,0.06)',
          }}
        >
          {/* Nap duration slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70 font-light">Nap duration</span>
              <span className="text-sm text-white/90 font-medium tabular-nums">
                {napDuration} min
              </span>
            </div>
            <Slider
              value={[napDuration]}
              onValueChange={([val]) => onNapDurationChange(val)}
              min={5}
              max={120}
              step={5}
              className="[&_[data-radix-slider-track]]:h-1 [&_[data-radix-slider-track]]:bg-white/10 [&_[data-radix-slider-range]]:bg-white/40 [&_[data-radix-slider-thumb]]:h-4 [&_[data-radix-slider-thumb]]:w-4 [&_[data-radix-slider-thumb]]:bg-white [&_[data-radix-slider-thumb]]:border-0"
            />
            <div className="flex justify-between text-[10px] text-white/30">
              <span>5 min</span>
              <span>120 min</span>
            </div>
          </div>

          {/* Auto-stop alarm toggle */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <span className="text-sm text-white/70 font-light leading-tight block">
                Auto-stop alarm
              </span>
              <span className="text-[11px] text-white/35 leading-tight block mt-0.5">
                Stop ringing if you don't respond
              </span>
            </div>
            <Switch
              checked={autoStopAlarm}
              onCheckedChange={onAutoStopAlarmChange}
              className="data-[state=checked]:bg-white/30 data-[state=unchecked]:bg-white/10 border-white/10"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NapSettings;
