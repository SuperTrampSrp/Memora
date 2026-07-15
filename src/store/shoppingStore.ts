import { create } from "zustand";
import {
    clearBoughtItems,
    createShoppingItem,
    deleteShoppingItem,
    getAllShoppingItems,
    getBoughtItems,
    toggleShoppingItem,
} from "../database/shopping";
import { ShoppingItem } from "../types";

interface ShoppingStore {
  items: ShoppingItem[];
  boughtItems: ShoppingItem[];
  loadItems: () => void;
  addItem: (item: Omit<ShoppingItem, "id" | "bought" | "createdAt">) => void;
  toggleItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearBought: () => void;
}

export const useShoppingStore = create<ShoppingStore>((set) => ({
  items: [],
  boughtItems: [],

  loadItems: () => {
    set({
      items: getAllShoppingItems(),
      boughtItems: getBoughtItems(),
    });
  },

  addItem: (item) => {
    createShoppingItem(item);
    set({
      items: getAllShoppingItems(),
      boughtItems: getBoughtItems(),
    });
  },

  toggleItem: (id) => {
    toggleShoppingItem(id);
    set({
      items: getAllShoppingItems(),
      boughtItems: getBoughtItems(),
    });
  },

  removeItem: (id) => {
    deleteShoppingItem(id);
    set({
      items: getAllShoppingItems(),
      boughtItems: getBoughtItems(),
    });
  },

  clearBought: () => {
    clearBoughtItems();
    set({
      items: getAllShoppingItems(),
      boughtItems: [],
    });
  },
}));
