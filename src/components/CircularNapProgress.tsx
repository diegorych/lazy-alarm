
import { useState, useEffect } from 'react';

interface CircularNapProgressProps {
  startTime?: number;
  actualDuration?: number;
  isTransitioning?: boolean;
  children?: React.ReactNode;
}

const SEGMENTS = 12;
const SEGMENT_GAP = 6; // degrees gap between segments
const SEGMENT_ARC = (360 - SEGMENTS * SEGMENT_GAP) / SEGMENTS; // degrees per segment

const CircularNapProgress = ({
  startTime,
  actualDuration,
  isTransitioning = false,
  children,
}: CircularNapProgressProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!startTime || !actualDuration) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / actualDuration, 1);
      setProgress(p);
    }, 500);

    return () => clearInterval(interval);
  }, [startTime, actualDuration]);

  const size = 280;
  const center = size / 2;
  const radius = 120;
  const strokeWidth = 28;

  const polarToCartesian = (angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
  };

  const createSegmentPath = (startAngle: number, endAngle: number) => {
    const innerRadius = radius - strokeWidth / 2;
    const outerRadius = radius + strokeWidth / 2;
    const cornerRadius = 5;

    const outerStart = polarToCartesianFull(center, center, outerRadius, startAngle);
    const outerEnd = polarToCartesianFull(center, center, outerRadius, endAngle);
    const innerStart = polarToCartesianFull(center, center, innerRadius, endAngle);
    const innerEnd = polarToCartesianFull(center, center, innerRadius, startAngle);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${outerStart.x} ${outerStart.y} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y} L ${innerStart.x} ${innerStart.y} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y} Z`;
  };

  const polarToCartesianFull = (cx: number, cy: number, r: number, angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const filledSegments = progress * SEGMENTS;

  return (
    <div className={`relative inline-flex items-center justify-center transition-opacity duration-1000 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {Array.from({ length: SEGMENTS }).map((_, i) => {
          const startAngle = i * (SEGMENT_ARC + SEGMENT_GAP);
          const endAngle = startAngle + SEGMENT_ARC;
          
          // Determine segment fill level
          const segmentProgress = Math.max(0, Math.min(1, filledSegments - i));
          
          // Base opacity for unfilled, full opacity for filled
          const baseOpacity = 0.15;
          const fillOpacity = baseOpacity + segmentProgress * (0.85);
          
          return (
            <path
              key={i}
              d={createSegmentPath(startAngle, endAngle)}
              fill={`rgba(255, 255, 255, ${fillOpacity})`}
              rx={5}
              className="transition-all duration-1000"
            />
          );
        })}
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-[180px] text-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CircularNapProgress;
