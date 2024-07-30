import { create } from "zustand";

interface PromptFeedUpdateState {
  updatePrompts: boolean;
  setUpdatePrompts: (update: boolean) => void;
}

// Create the store
const usePromptFeedUpdateStore = create<PromptFeedUpdateState>((set) => ({
  updatePrompts: false, // Initial state
  setUpdatePrompts: (updatePrompts) => set({ updatePrompts }),
}));

export default usePromptFeedUpdateStore;
