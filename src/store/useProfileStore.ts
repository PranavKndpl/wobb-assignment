import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfileSummary, Platform } from "@/types";

interface ProfileStore {
  // List State
  savedProfiles: UserProfileSummary[];
  addProfile: (profile: UserProfileSummary) => void;
  removeProfile: (username: string) => void;
  
  // Search State 
  currentPlatform: Platform;
  setPlatform: (platform: Platform) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Scroll tracking
  searchScrollY: number;
  setSearchScrollY: (y: number) => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      savedProfiles: [],
      currentPlatform: "instagram",
      searchQuery: "",
      searchScrollY: 0,
      
      addProfile: (profile) =>
        set((state) => {
          const isDuplicate = state.savedProfiles.some((p) => p.username === profile.username);
          if (isDuplicate) return state;
          return { savedProfiles: [...state.savedProfiles, profile] };
        }),

      removeProfile: (username) =>
        set((state) => ({
          savedProfiles: state.savedProfiles.filter((p) => p.username !== username),
        })),

      setPlatform: (platform) => set({ currentPlatform: platform }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSearchScrollY: (y) => set({ searchScrollY: y }), 
    }),
    {
      name: "influencer-app-storage", 
    }
  )
);