import { create } from "zustand";
import { AuthState } from "./types/state";
import { devtools, persist } from "zustand/middleware";
import { syncTabs } from "zustand-sync-tabs";

export const useAuth = create<AuthState>()(
  devtools(
    persist(
      syncTabs(
        (set) => ({
          user: null,
          login: (user) => set({ user }),
          logout: () => set({ user: null }),
        }),
        {
          name: "auth",
        }
      ),
      {
        name: "auth",
      }
    )
  )
);
