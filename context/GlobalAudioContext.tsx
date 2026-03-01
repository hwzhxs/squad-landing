'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface AudioContextType {
  muted: boolean;
  toggleMute: () => Promise<void>;
  registerVideo: (el: HTMLVideoElement) => void;
  unregisterVideo: (el: HTMLVideoElement) => void;
}

const AudioCtx = createContext<AudioContextType>({
  muted: true,
  toggleMute: async () => {},
  registerVideo: () => {},
  unregisterVideo: () => {},
});

export function GlobalAudioProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(true);
  const mutedRef = useRef(true); // tracks latest muted value without stale closures
  const videos = useRef<Set<HTMLVideoElement>>(new Set());

  const registerVideo = useCallback((el: HTMLVideoElement) => {
    videos.current.add(el);
    // Sync to current global muted state (use ref to avoid stale closure)
    el.muted = mutedRef.current;
  }, []);

  const unregisterVideo = useCallback((el: HTMLVideoElement) => {
    videos.current.delete(el);
  }, []);

  const toggleMute = useCallback(async () => {
    const nextMuted = !mutedRef.current;

    if (!nextMuted) {
      // --- UNMUTING ---
      // Step 1: Mutate DOM synchronously (Safari requires this in the user-gesture callstack)
      videos.current.forEach((v) => {
        v.volume = 1;
        v.muted = false;
      });

      // Step 2: Attempt to play any paused videos (async - may be blocked by autoplay policy)
      const playPromises: Promise<void>[] = [];
      videos.current.forEach((v) => {
        if (v.paused) {
          playPromises.push(
            v.play().catch(() => {
              // Autoplay blocked — re-mute this video
              v.muted = true;
            })
          );
        }
      });

      // Wait for all play attempts
      await Promise.allSettled(playPromises);

      // Step 3: Check if at least the hero video (or any registered video) actually unmuted.
      // If ALL videos failed to play and were re-muted, keep state as muted.
      const anyUnmuted = Array.from(videos.current).some((v) => !v.muted);
      if (!anyUnmuted && playPromises.length > 0) {
        // All play() calls failed — stay muted
        return;
      }
    } else {
      // --- MUTING ---
      // Synchronous — no async needed
      videos.current.forEach((v) => {
        v.muted = true;
      });
    }

    mutedRef.current = nextMuted;
    setMuted(nextMuted);
  }, []); // no deps — uses refs only

  return (
    <AudioCtx.Provider value={{ muted, toggleMute, registerVideo, unregisterVideo }}>
      {children}
    </AudioCtx.Provider>
  );
}

export function useGlobalAudio() {
  return useContext(AudioCtx);
}
