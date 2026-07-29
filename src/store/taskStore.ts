import { create } from "zustand";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTasksDueToday,
  toggleTask,
} from "../database/tasks";
import { Task } from "../types";
import {
  cancelTaskReminder,
  scheduleTaskReminder,
} from "../utils/notifications";

interface TaskStore {
  tasks: Task[];
  todayTasks: Task[];
  loadTasks: () => void;
  addTask: (task: Omit<Task, "id" | "completed" | "createdAt">) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  todayTasks: [],

  loadTasks: () => {
    set({
      tasks: getAllTasks(),
      todayTasks: getTasksDueToday(),
    });
  },

  addTask: async (task) => {
    const created = createTask(task);
    await scheduleTaskReminder(created);
    set({
      tasks: getAllTasks(),
      todayTasks: getTasksDueToday(),
    });
  },

  toggleTask: (id) => {
    toggleTask(id);
    set({
      tasks: getAllTasks(),
      todayTasks: getTasksDueToday(),
    });
  },

  removeTask: async (id) => {
    await cancelTaskReminder(id);
    deleteTask(id);
    set({
      tasks: getAllTasks(),
      todayTasks: getTasksDueToday(),
    });
  },
}));
