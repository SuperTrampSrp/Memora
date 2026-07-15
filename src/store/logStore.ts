import { create } from "zustand";
import { createLog, deleteLog, getAllLogs, searchLogs } from "../database/logs";
import { LogEntry } from "../types";

interface LogStore {
  logs: LogEntry[];
  loadLogs: () => void;
  search: (query: string) => void;
  addLog: (log: Omit<LogEntry, "id" | "createdAt">) => void;
  removeLog: (id: string) => void;
}

export const useLogStore = create<LogStore>((set) => ({
  logs: [],

  loadLogs: () => {
    set({ logs: getAllLogs() });
  },

  search: (query) => {
    if (!query.trim()) {
      set({ logs: getAllLogs() });
    } else {
      set({ logs: searchLogs(query) });
    }
  },

  addLog: (log) => {
    createLog(log);
    set({ logs: getAllLogs() });
  },

  removeLog: (id) => {
    deleteLog(id);
    set({ logs: getAllLogs() });
  },
}));
