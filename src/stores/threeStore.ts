import { create } from "zustand";

interface ThreeStore {
  loadingComplete: boolean;
  loadingOnChange: () => void;
}

export const threeStore = create<ThreeStore>((set) => ({
  loadingComplete: false,
  loadingOnChange: () => set(() => ({ loadingComplete: true })),
}));
