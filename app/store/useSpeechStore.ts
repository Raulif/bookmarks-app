import { create } from "zustand";

import { SpeechManager } from "../lib/SpeechManager";

interface Store {
  speechManager: InstanceType<typeof SpeechManager> | null;
  setSpeechManager: (speechManager: SpeechManager) => void;
  speaking: boolean;
  setSpeaking: (speaking: boolean) => void;
  gettingText: boolean;
  setGettingText: (gettingText: boolean) => void;
  abortController: AbortController;
  setAbortController: (abortController: AbortController) => void;
  currentTrackId: string
  setCurrentTrackId: (currentTrackdId: string) => void
}

export const useSpeachStore = create<Store>()((set) => ({
  speechManager: null,
  setSpeechManager: (speechManager) => set({ speechManager }),
  speaking: false,
  setSpeaking: (speaking) => set({ speaking }),
  gettingText: false,
  setGettingText: (gettingText) => set({ gettingText }),
  abortController: new AbortController(),
  setAbortController: (abortController) => set({ abortController }),
  currentTrackId: '',
  setCurrentTrackId: (currentTrackId: string) => set({currentTrackId})
}));
