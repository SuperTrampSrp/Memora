// ─── HABITS ───────────────────────────────────────────────
export type HabitFrequency = "daily" | "weekdays" | "weekends" | "custom";

export interface Habit {
  id: string;
  title: string;
  emoji: string;
  frequency: HabitFrequency;
  reminderTime: string | null; // "08:00"
  streak: number;
  longestStreak: number;
  completedToday: boolean;
  createdAt: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  completedAt: string; // ISO date string
}

// ─── CHECKLIST ────────────────────────────────────────────
export interface ChecklistItem {
  id: string;
  title: string;
  checked: boolean;
  sortOrder: number;
}

// ─── SHOPPING ─────────────────────────────────────────────
export type ShoppingPriority = "necessary" | "urgent" | "can_skip";
export type ShoppingCategory =
  | "grocery"
  | "vegetable"
  | "fruit"
  | "dairy"
  | "meat"
  | "electronics"
  | "clothing"
  | "household"
  | "medicine"
  | "other";

export interface ShoppingItem {
  id: string;
  title: string;
  category: ShoppingCategory;
  priority: ShoppingPriority;
  quantity: string | null;
  bought: boolean;
  createdAt: string;
}

// ─── BILLS & SUBSCRIPTIONS ────────────────────────────────
export type BillFrequency = "monthly" | "yearly" | "weekly" | "one_time";

export interface Bill {
  id: string;
  title: string;
  amount: number | null;
  frequency: BillFrequency;
  dueDate: string; // next due date ISO string
  reminderDaysBefore: number; // 1, 3, 7
  paid: boolean;
  autoPay: boolean;
  category: string; // "electricity", "internet", etc.
  createdAt: string;
}

// ─── TASKS ────────────────────────────────────────────────
export type TaskPriority = "high" | "medium" | "low";

export interface Task {
  id: string;
  title: string;
  notes: string | null;
  priority: TaskPriority;
  dueDate: string | null;
  dueTime: string | null;
  completed: boolean;
  createdAt: string;
}

// ─── SOCIAL EVENTS ────────────────────────────────────────
export type SocialEventType = "birthday" | "anniversary" | "festival" | "other";

export interface SocialEvent {
  id: string;
  title: string;
  person: string | null;
  type: SocialEventType;
  date: string; // MM-DD (yearly recurring)
  reminderDaysBefore: number;
  createdAt: string;
}

// ─── LOGS ─────────────────────────────────────────────────
export type LogType = "visit" | "email" | "call" | "meeting" | "note" | "other";

export interface LogEntry {
  id: string;
  type: LogType;
  title: string;
  description: string | null;
  person: string | null; // who it was with
  startDate: string;
  endDate: string | null; // for visits with date ranges
  createdAt: string;
}

// ─── TODAY SCREEN AGGREGATION ─────────────────────────────
export interface TodaySection {
  habits: Habit[];
  checklistItems: ChecklistItem[];
  urgentShopping: ShoppingItem[];
  billsDueSoon: Bill[];
  tasksToday: Task[];
  upcomingSocialEvents: SocialEvent[];
}
