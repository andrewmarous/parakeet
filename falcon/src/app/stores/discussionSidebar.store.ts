import { create } from "zustand";

interface UpdateState {
  update: number;
  setUpdate: (update: number) => void;
  updatePage: number;
  setUpdatePage: (updatePage: number) => void;
}

// Create the store
const useUpdateStore = create<UpdateState>((set) => ({
  update: -1, // Initial state
  setUpdate: (update) => set({ update }),
  updatePage: -1,
  setUpdatePage: (updatePage) => set({ updatePage }),
}));

export default useUpdateStore;
