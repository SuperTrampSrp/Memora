import { Task } from "../types";
import db from "./index";

export function getAllTasks(): Task[] {
  return db.getAllSync(
    `SELECT * FROM tasks
     ORDER BY
       CASE priority
         WHEN 'high'   THEN 1
         WHEN 'medium' THEN 2
         WHEN 'low'    THEN 3
       END,
       dueDate ASC NULLS LAST,
       createdAt ASC`,
  ) as Task[];
}

export function getTasksDueToday(): Task[] {
  const today = new Date().toISOString().split("T")[0];
  return db.getAllSync(
    `SELECT * FROM tasks
     WHERE completed = 0
       AND dueDate = ?
     ORDER BY
       CASE priority
         WHEN 'high'   THEN 1
         WHEN 'medium' THEN 2
         WHEN 'low'    THEN 3
       END`,
    [today],
  ) as Task[];
}

export function createTask(
  task: Omit<Task, "id" | "completed" | "createdAt">,
): Task {
  const id = Math.random().toString(36).slice(2) + Date.now();
  const createdAt = new Date().toISOString();

  db.runSync(
    `INSERT INTO tasks
       (id, title, notes, priority, dueDate, dueTime, completed, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
    [
      id,
      task.title,
      task.notes ?? null,
      task.priority,
      task.dueDate ?? null,
      task.dueTime ?? null,
      createdAt,
    ],
  );

  return { ...task, id, completed: false, createdAt };
}

export function toggleTask(id: string): void {
  db.runSync(
    `UPDATE tasks
     SET completed = CASE WHEN completed = 1 THEN 0 ELSE 1 END
     WHERE id = ?`,
    [id],
  );
}

export function deleteTask(id: string): void {
  db.runSync(`DELETE FROM tasks WHERE id = ?`, [id]);
}
