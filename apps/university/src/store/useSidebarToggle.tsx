import { create } from "zustand";

type SidebarState = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void; // Accepts a boolean parameter
};

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true, // Initial state
  setIsOpen: (isOpen) => set({ isOpen }), // Updates the state with the provided value
}));
