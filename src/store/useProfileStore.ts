import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfileSummary } from "@/types";

interface ProfileStore {
  savedProfiles: UserProfileSummary[];
  addProfile: (profile: UserProfileSummary) => void;
  removeProfile: (username: string) => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      savedProfiles: [],
      
      addProfile: (profile) =>
        set((state) => {
          const isDuplicate = state.savedProfiles.some(
            (p) => p.username === profile.username
          );
          
          if (isDuplicate) return state; 
          
          return { savedProfiles: [...state.savedProfiles, profile] };
        }),

      removeProfile: (username) =>
        set((state) => ({
          savedProfiles: state.savedProfiles.filter(
            (p) => p.username !== username
          ),
        })),
    }),
    {
      name: "influencer-list-storage", 
    }
  )
);