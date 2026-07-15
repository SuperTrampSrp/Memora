import { create } from "zustand";
import {
    createChecklistItem,
    deleteChecklistItem,
    getAllChecklistItems,
    resetChecklist,
    toggleChecklistItem,
} from "../database/checklist";
import { ChecklistItem } from "../types";

interface ChecklistStore {
  items: ChecklistItem[];
  loadItems: () => void;
  addItem: (title: string) => void;
  toggleItem: (id: string) => void;
  resetAll: () => void;
  removeItem: (id: string) => void;
}

export const useChecklistStore = create<ChecklistStore>((set) => ({
  items: [],

  loadItems: () => {
    const items = getAllChecklistItems();
    set({ items });
  },

  addItem: (title) => {
    createChecklistItem(title);
    set({ items: getAllChecklistItems() });
  },

  toggleItem: (id) => {
    toggleChecklistItem(id);
    set({ items: getAllChecklistItems() });
  },

  resetAll: () => {
    resetChecklist();
    set({ items: getAllChecklistItems() });
  },

  removeItem: (id) => {
    deleteChecklistItem(id);
    set({ items: getAllChecklistItems() });
  },
}));
