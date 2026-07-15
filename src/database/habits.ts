import { Habit } from "../types";
import db from "./index";

// ── helpers ──────────────────────────────────────────────
function todayISO() {
  return new Date().toISOString().split("T")[0]; // "2025-01-14"
}

// ── read ─────────────────────────────────────────────────
export function getAllHabits(): Habit[] {
  const today = todayISO();
  const rows = db.getAllSync(
    `SELECT h.*,
       CASE WHEN EXISTS (
         SELECT 1 FROM habitLogs l
         WHERE l.habitId = h.id AND l.completedAt = ?
       ) THEN 1 ELSE 0 END as completedToday
     FROM habits h
     ORDER BY h.createdAt ASC`,
    [today],
  ) as any[];

  return rows.map((r) => ({
    ...r,
    completedToday: r.completedToday === 1,
  }));
}

// ── create ───────────────────────────────────────────────
export function createHabit(
  habit: Omit<
    Habit,
    "id" | "streak" | "longestStreak" | "completedToday" | "createdAt"
  >,
): Habit {
  const id = Math.random().toString(36).slice(2) + Date.now();
  const createdAt = new Date().toISOString();

  db.runSync(
    `INSERT INTO habits
       (id, title, emoji, frequency, reminderTime, streak, longestStreak, completedToday, createdAt)
     VALUES (?, ?, ?, ?, ?, 0, 0, 0, ?)`,
    [
      id,
      habit.title,
      habit.emoji,
      habit.frequency,
      habit.reminderTime ?? null,
      createdAt,
    ],
  );

  return {
    ...habit,
    id,
    streak: 0,
    longestStreak: 0,
    completedToday: false,
    createdAt,
  };
}

// ── toggle complete ───────────────────────────────────────
export function toggleHabitComplete(habitId: string): Habit {
  const today = todayISO();

  const existing = db.getFirstSync(
    `SELECT * FROM habitLogs WHERE habitId = ? AND completedAt = ?`,
    [habitId, today],
  ) as any;

  if (existing) {
    // un-complete → remove log, decrease streak
    db.runSync(`DELETE FROM habitLogs WHERE habitId = ? AND completedAt = ?`, [
      habitId,
      today,
    ]);
    db.runSync(`UPDATE habits SET streak = MAX(0, streak - 1) WHERE id = ?`, [
      habitId,
    ]);
  } else {
    // complete → add log, increase streak
    const logId = Math.random().toString(36).slice(2) + Date.now();
    db.runSync(
      `INSERT INTO habitLogs (id, habitId, completedAt) VALUES (?, ?, ?)`,
      [logId, habitId, today],
    );
    db.runSync(
      `UPDATE habits
       SET streak = streak + 1,
           longestStreak = MAX(longestStreak, streak + 1)
       WHERE id = ?`,
      [habitId],
    );
  }

  return db.getFirstSync(`SELECT * FROM habits WHERE id = ?`, [
    habitId,
  ]) as Habit;
}

// ── delete ───────────────────────────────────────────────
export function deleteHabit(id: string) {
  db.runSync(`DELETE FROM habits WHERE id = ?`, [id]);
}
