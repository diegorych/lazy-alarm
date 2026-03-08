import { Settings, X } from 'lucide-react';
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
    <>
      <div className="absolute top-10 right-6 z-30">
        <button
          onClick={() => setIsOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 bg-white/[0.06] text-white/50 border border-white/[0.08] hover:bg-white/10 hover:text-white/70"
        >
          <Settings size={16} />
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col animate-fade-in"
          style={{
            background: 'rgba(6, 6, 8, 0.97)',
            WebkitBackdropFilter: 'blur(40px)',
            backdropFilter: 'blur(40px) saturate(1.4)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-10 pb-6">
            <h2 className="text-lg text-white/90 font-light tracking-wide">Settings</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.06] text-white/50 border border-white/[0.08] hover:bg-white/10 hover:text-white/70 transition-all duration-300"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 px-6 space-y-8 overflow-y-auto">
            {/* Nap duration slider */}
            <div className="space-y-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-white/60 font-light tracking-wide">Nap duration</span>
                <span className="text-2xl text-white/95 font-light tabular-nums tracking-tight">
                  {napDuration}<span className="text-sm text-white/40 ml-1">min</span>
                </span>
              </div>
              <Slider
                value={[napDuration]}
                onValueChange={([val]) => onNapDurationChange(val)}
                min={5}
                max={120}
                step={5}
                className="[&_[data-radix-slider-track]]:h-[6px] [&_[data-radix-slider-track]]:bg-white/[0.06] [&_[data-radix-slider-track]]:rounded-full [&_[data-radix-slider-range]]:bg-gradient-to-r [&_[data-radix-slider-range]]:from-white/50 [&_[data-radix-slider-range]]:to-white/30 [&_[data-radix-slider-range]]:rounded-full [&_[data-radix-slider-thumb]]:h-[22px] [&_[data-radix-slider-thumb]]:w-[22px] [&_[data-radix-slider-thumb]]:bg-white [&_[data-radix-slider-thumb]]:border-0 [&_[data-radix-slider-thumb]]:shadow-[0_0_12px_rgba(255,255,255,0.25)] [&_[data-radix-slider-thumb]]:transition-shadow [&_[data-radix-slider-thumb]]:duration-200 [&_[data-radix-slider-thumb]]:hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] [&_[data-radix-slider-thumb]]:focus-visible:ring-0 [&_[data-radix-slider-thumb]]:focus-visible:ring-offset-0"
              />
              <div className="flex justify-between text-[11px] text-white/25 font-light">
                <span>5 min</span>
                <span>2 hrs</span>
              </div>
            </div>

            <div className="h-px bg-white/[0.06]" />

            {/* Auto-stop alarm toggle */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <span className="text-sm text-white/70 font-light leading-tight block">
                  Auto-stop alarm
                </span>
                <span className="text-[12px] text-white/35 leading-tight block mt-1">
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
        </div>
      )}
    </>
  );
};

export default NapSettings;
