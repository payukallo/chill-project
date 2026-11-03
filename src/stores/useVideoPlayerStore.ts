import { create } from "zustand";

interface IVideoPlayerStore {
  isPlaying: boolean;
  volume: number;
  playbackRate: number;
  currentTime: number;
  duration: number;
  showDescription: boolean;
  showControls: boolean;

  setIsPlaying: (value: boolean) => void;
  setVolume: (value: number) => void;
  setPlaybackRate: (value: number) => void;
  setCurrentTime: (value: number) => void;
  setDuration: (value: number) => void;
  setShowDescription: (value: boolean) => void;
  setShowControls: (value: boolean) => void;
  resetPlayer: () => void;
}

const initialState = {
  isPlaying: false,
  volume: 1,
  playbackRate: 1,
  currentTime: 0,
  duration: 0,
  showDescription: false,
  showControls: true,
};

export const useVideoPlayerStore = create<IVideoPlayerStore>((set) => ({
  ...initialState,

  setIsPlaying: (value) => set({ isPlaying: value }),

  setVolume: (value) => set({ volume: value }),

  setPlaybackRate: (value) => set({ playbackRate: value }),

  setCurrentTime: (value) => set({ currentTime: value }),

  setDuration: (value) => set({ duration: value }),

  setShowDescription: (value) => set({ showDescription: value }),

  setShowControls: (value) => set({ showControls: value }),

  resetPlayer: () => set(initialState),
}));
