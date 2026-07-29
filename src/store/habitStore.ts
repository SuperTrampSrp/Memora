import { create } from "zustand";
import {
  createHabit,
  deleteHabit,
  getAllHabits,
  toggleHabitComplete,
} from "../database/habits";
import { Habit } from "../types";
import {
  cancelHabitReminder,
  scheduleHabitReminder,
} from "../utils/notifications";

interface HabitStore {
  habits: Habit[];
  loadHabits: () => void;
  addHabit: (
    habit: Omit<
      Habit,
      "id" | "streak" | "longestStreak" | "completedToday" | "createdAt"
    >,
  ) => void;
  toggleHabit: (id: string) => void;
  removeHabit: (id: string) => void;
}

export const useHabitStore = create<HabitStore>((set) => ({
  habits: [],

  loadHabits: () => {
    set({ habits: getAllHabits() });
  },

  addHabit: async (habit) => {
    const created = createHabit(habit);
    await scheduleHabitReminder(created);
    set({ habits: getAllHabits() });
  },

  toggleHabit: (id) => {
    toggleHabitComplete(id);
    set({ habits: getAllHabits() });
  },

  removeHabit: async (id) => {
    await cancelHabitReminder(id);
    deleteHabit(id);
    set({ habits: getAllHabits() });
  },
}));
