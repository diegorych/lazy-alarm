import { useEffect, useRef } from 'react';

const NUM_STARS = 60;

interface Star {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  phase: number;
  speed: number;
  driftX: number;
  driftY: number;
}

const StarField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Init stars
    starsRef.current = Array.from({ length: NUM_STARS }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      baseOpacity: Math.random() * 0.5 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.0003 + 0.0002,
      driftX: (Math.random() - 0.5) * 0.015,
      driftY: (Math.random() - 0.5) * 0.01,
    }));

    const ctx = canvas.getContext('2d')!;
    let last = performance.now();

    const draw = (now: number) => {
      const dt = now - last;
      last = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const star of starsRef.current) {
        star.phase += star.speed * dt;
        const opacity = star.baseOpacity * (0.5 + 0.5 * Math.sin(star.phase));
        star.x += star.driftX * (dt / 16);
        star.y += star.driftY * (dt / 16);

        // Wrap around
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] pointer-events-none"
    />
  );
};

export default StarField;
