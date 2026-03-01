'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface AudioContextType {
  muted: boolean;
  toggleMute: () => void;
  registerVideo: (el: HTMLVideoElement) => void;
  unregisterVideo: (el: HTMLVideoElement) => void;
}

const AudioCtx = createContext<AudioContextType>({
  muted: true,
  toggleMute: () => {},
  registerVideo: () => {},
  unregisterVideo: () => {},
});

export function GlobalAudioProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(true);
  const videos = useRef<Set<HTMLVideoElement>>(new Set());

  const registerVideo = useCallback((el: HTMLVideoElement) => {
    videos.current.add(el);
    el.muted = muted;
  }, [muted]);

  const unregisterVideo = useCallback((el: HTMLVideoElement) => {
    videos.current.delete(el);
  }, []);

  const toggleMute = useCallback(() => {
    const next = !muted;
    setMuted(next);
    videos.current.forEach((v) => {
      v.muted = next;
      if (!next && v.paused === false) {
        // ensure volume is audible
        v.volume = 1;
      }
    });
  }, [muted]);

  return (
    <AudioCtx.Provider value={{ muted, toggleMute, registerVideo, unregisterVideo }}>
      {children}
    </AudioCtx.Provider>
  );
}

export function useGlobalAudio() {
  return useContext(AudioCtx);
}
