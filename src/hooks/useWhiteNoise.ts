import { useState, useRef, useEffect, useCallback } from 'react';

const useWhiteNoise = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const start = useCallback(() => {
    if (audioCtxRef.current) return;

    const ctx = new AudioContext();
    const bufferSize = ctx.sampleRate * 2; // 2 seconds loop
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    // Apply simple brownian-ish filtering for softer noise
    const filtered = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const fData = filtered.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      last = (last + (0.02 * data[i])) / 1.02;
      fData[i] = last * 3.5;
    }

    const source = ctx.createBufferSource();
    source.buffer = filtered;
    source.loop = true;

    const gain = ctx.createGain();
    gain.gain.value = 0.5;

    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();

    audioCtxRef.current = ctx;
    nodeRef.current = source;
    gainRef.current = gain;
    setIsPlaying(true);
  }, []);

  const stop = useCallback(() => {
    nodeRef.current?.stop();
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    nodeRef.current = null;
    gainRef.current = null;
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) stop();
    else start();
  }, [isPlaying, start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      nodeRef.current?.stop();
      audioCtxRef.current?.close();
    };
  }, []);

  return { isPlaying, toggle, stop };
};

export default useWhiteNoise;
