import { create } from "zustand";
import type { Guide } from "../types/guide";
import { getAllGuides } from "../lib/guideData";

export type ViewMode = "list" | "guide";

interface RoundtableState {
  guides: Guide[];
  view: ViewMode;
  selectedGuideId: string | null;
  searchQuery: string;
  selectedSeries: string | null;

  setView: (view: ViewMode) => void;
  selectGuide: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedSeries: (series: string | null) => void;
}

export const useRoundtableStore = create<RoundtableState>((set) => ({
  guides: getAllGuides(),
  view: "list",
  selectedGuideId: null,
  searchQuery: "",
  selectedSeries: null,

  setView: (view) => set({ view }),
  selectGuide: (id) => set({ selectedGuideId: id }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedSeries: (series) => set({ selectedSeries: series }),
}));
