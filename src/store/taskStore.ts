import { create } from "zustand";
import {
    createTask,
    deleteTask,
    getAllTasks,
    getTasksDueToday,
    toggleTask,
} from "../database/tasks";
import { Task } from "../types";

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

  addTask: (task) => {
    createTask(task);
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

  removeTask: (id) => {
    deleteTask(id);
    set({
      tasks: getAllTasks(),
      todayTasks: getTasksDueToday(),
    });
  },
}));
