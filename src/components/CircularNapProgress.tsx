
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
const ROTATION_OFFSET = -(SEGMENT_ARC / 2); // center first segment at top

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

  const size = 320;
  const center = size / 2;
  const radius = 135;
  const strokeWidth = 30;
  const cornerRadius = 4;

  const polarToCartesianFull = (cx: number, cy: number, r: number, angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const createSegmentPath = (startAngle: number, endAngle: number) => {
    const innerRadius = radius - strokeWidth / 2;
    const outerRadius = radius + strokeWidth / 2;

    const outerStart = polarToCartesianFull(center, center, outerRadius, startAngle);
    const outerEnd = polarToCartesianFull(center, center, outerRadius, endAngle);
    const innerStart = polarToCartesianFull(center, center, innerRadius, endAngle);
    const innerEnd = polarToCartesianFull(center, center, innerRadius, startAngle);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${outerStart.x} ${outerStart.y} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y} L ${innerStart.x} ${innerStart.y} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y} Z`;
  };

  const filledSegments = progress * SEGMENTS;

  return (
    <div className={`relative inline-flex items-center justify-center transition-opacity duration-1000 ${isTransitioning ? 'opacity-0' : 'opacity-100'} w-[320px] h-[320px] md:w-[460px] md:h-[460px]`}>
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
        <defs>
          {/* Glow filter for completed segments */}
          <filter id="segmentGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 1  0 1 0 0 1  0 0 1 0 1  0 0 0 0.3 0" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Inner shadow for completed segments */}
          <filter id="innerShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feComponentTransfer in="SourceAlpha">
              <feFuncA type="table" tableValues="1 0" />
            </feComponentTransfer>
            <feGaussianBlur stdDeviation="2" />
            <feOffset dx="0" dy="1" result="offsetblur" />
            <feFlood floodColor="rgba(0,0,0,0.5)" result="color" />
            <feComposite in2="offsetblur" operator="in" />
            <feComposite in2="SourceAlpha" operator="in" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode />
            </feMerge>
          </filter>
        </defs>
        <g transform={`rotate(${ROTATION_OFFSET}, ${center}, ${center})`}>
          {Array.from({ length: SEGMENTS }).map((_, i) => {
            const startAngle = i * (SEGMENT_ARC + SEGMENT_GAP);
            const endAngle = startAngle + SEGMENT_ARC;
            const segmentProgress = Math.max(0, Math.min(1, filledSegments - i));
            const isCompleted = segmentProgress >= 0.99;
            const baseOpacity = 0.15;
            const fillOpacity = baseOpacity + segmentProgress * 0.85;

            const hasProgress = segmentProgress > 0.01;
            return (
              <g key={i} filter={isCompleted ? 'url(#segmentGlow)' : hasProgress ? 'url(#innerShadow)' : undefined}>
                <path
                  d={createSegmentPath(startAngle, endAngle)}
                  fill={`rgba(255, 255, 255, ${fillOpacity})`}
                  className="transition-all duration-1000"
                />
                {hasProgress && (
                  <path
                    d={createSegmentPath(startAngle, endAngle)}
                    fill="none"
                    stroke={`rgba(255, 255, 255, ${fillOpacity})`}
                    strokeWidth={cornerRadius * 2}
                    strokeLinejoin="round"
                    paintOrder="stroke"
                    className="transition-all duration-1000"
                  />
              </g>
            );
          })}
        </g>
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default CircularNapProgress;
