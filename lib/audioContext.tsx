'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface AudioContextValue {
  globalMuted: boolean;
  setGlobalMuted: (v: boolean) => void;
}

const AudioCtx = createContext<AudioContextValue>({
  globalMuted: true,
  setGlobalMuted: () => {},
});

export function AudioProvider({ children }: { children: ReactNode }) {
  const [globalMuted, setGlobalMutedState] = useState(true);

  const setGlobalMuted = useCallback((v: boolean) => {
    setGlobalMutedState(v);
  }, []);

  return (
    <AudioCtx.Provider value={{ globalMuted, setGlobalMuted }}>
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  return useContext(AudioCtx);
}
