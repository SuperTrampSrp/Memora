import { create } from "zustand";
import {
    createHabit,
    deleteHabit,
    getAllHabits,
    toggleHabitComplete,
} from "../database/habits";
import { Habit } from "../types";

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
    const habits = getAllHabits();
    set({ habits });
  },

  addHabit: (habit) => {
    createHabit(habit);
    const habits = getAllHabits();
    set({ habits });
  },

  toggleHabit: (id) => {
    toggleHabitComplete(id);
    const habits = getAllHabits();
    set({ habits });
  },

  removeHabit: (id) => {
    deleteHabit(id);
    const habits = getAllHabits();
    set({ habits });
  },
}));
