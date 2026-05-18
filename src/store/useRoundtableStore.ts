import { create } from "zustand";
import type { Guide } from "../types/guide";
import { getAllGuides } from "../lib/guideData";

export type ViewMode = "list" | "guide";

interface RoundtableState {
  guides: Guide[];
  isLoading: boolean;
  view: ViewMode;
  selectedGuideId: string | null;
  searchQuery: string;
  selectedSeries: string | null;

  loadGuides: () => Promise<void>;
  setView: (view: ViewMode) => void;
  selectGuide: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedSeries: (series: string | null) => void;
}

export const useRoundtableStore = create<RoundtableState>((set) => ({
  guides: [],
  isLoading: false,
  view: "list",
  selectedGuideId: null,
  searchQuery: "",
  selectedSeries: null,

  loadGuides: async () => {
    set({ isLoading: true });
    const guides = await getAllGuides();
    set((state) => ({
      guides,
      isLoading: false,
      selectedGuideId:
        state.selectedGuideId && guides.some((guide) => guide.id === state.selectedGuideId)
          ? state.selectedGuideId
          : null,
    }));
  },
  setView: (view) => set({ view }),
  selectGuide: (id) => set({ selectedGuideId: id }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedSeries: (series) => set({ selectedSeries: series }),
}));
