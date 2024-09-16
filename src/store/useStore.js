import { create } from "zustand";

const useModelStore = create((set) => ({
  selectedModel: "null",
  setSelectedModel: (model) => set({ selectedModel: model }),
  color: "#ffffff",
  setColor: (color) => set({ color }),
  isRotating: true,
  setIsRotating: () => set((state) => ({ isRotating: !state.isRotating })),
  image: null,
  setImage: (image) => set({ image }),
  stage: "stage1",
  setStage: (stage) => set({ stage }),
}));

export default useModelStore;
