import { useState, useRef, useEffect, useCallback } from 'react';

type SceneType = 'campfire' | 'stars' | 'room' | 'night-sky';

const SCENE_SOUNDS: Record<string, string | null> = {
  campfire: '/sounds/campfire.mp3',
  stars: '/sounds/night.mp3',
  room: null, // uses generated brown noise
  'night-sky': '/sounds/night.mp3',
};

const useAmbientSound = (scene: SceneType = 'campfire') => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Brown noise refs (for room scene)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const stopAll = useCallback(() => {
    // Stop file-based audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    // Stop generated noise
    try { nodeRef.current?.stop(); } catch {}
    try { audioCtxRef.current?.close(); } catch {}
    audioCtxRef.current = null;
    nodeRef.current = null;
    gainRef.current = null;
  }, []);

  const startBrownNoise = useCallback(() => {
    const ctx = new AudioContext();
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const filtered = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const fData = filtered.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      last = (last + 0.02 * data[i]) / 1.02;
      fData[i] = last * 3.5;
    }
    const source = ctx.createBufferSource();
    source.buffer = filtered;
    source.loop = true;
    const gain = ctx.createGain();
    gain.gain.value = 0.35;
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    audioCtxRef.current = ctx;
    nodeRef.current = source;
    gainRef.current = gain;
  }, []);

  const startFileAudio = useCallback((src: string) => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.5;
    audio.play().catch(() => {});
    audioRef.current = audio;
  }, []);

  const start = useCallback(() => {
    stopAll();
    const soundSrc = SCENE_SOUNDS[scene];
    if (soundSrc) {
      startFileAudio(soundSrc);
    } else {
      startBrownNoise();
    }
    setIsPlaying(true);
  }, [scene, stopAll, startFileAudio, startBrownNoise]);

  const stop = useCallback(() => {
    stopAll();
    setIsPlaying(false);
  }, [stopAll]);

  const toggle = useCallback(() => {
    if (isPlaying) stop();
    else start();
  }, [isPlaying, start, stop]);

  // When scene changes and sound is playing, switch to new sound
  useEffect(() => {
    if (isPlaying) {
      stopAll();
      const soundSrc = SCENE_SOUNDS[scene];
      if (soundSrc) {
        startFileAudio(soundSrc);
      } else {
        startBrownNoise();
      }
    }
  }, [scene]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAll();
    };
  }, [stopAll]);

  return { isPlaying, toggle, stop };
};

export default useAmbientSound;
