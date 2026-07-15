import { ChecklistItem } from "../types";
import db from "./index";

export function getAllChecklistItems(): ChecklistItem[] {
  return db.getAllSync(
    `SELECT * FROM checklistItems ORDER BY sortOrder ASC`,
  ) as ChecklistItem[];
}

export function createChecklistItem(title: string): ChecklistItem {
  const id = Math.random().toString(36).slice(2) + Date.now();
  const sortOrder =
    (
      db.getFirstSync(
        `SELECT MAX(sortOrder) as maxOrder FROM checklistItems`,
      ) as any
    )?.maxOrder ?? 0;

  db.runSync(
    `INSERT INTO checklistItems (id, title, checked, sortOrder)
     VALUES (?, ?, 0, ?)`,
    [id, title, sortOrder + 1],
  );

  return { id, title, checked: false, sortOrder: sortOrder + 1 };
}

export function toggleChecklistItem(id: string): void {
  db.runSync(
    `UPDATE checklistItems SET checked = CASE WHEN checked = 1 THEN 0 ELSE 1 END WHERE id = ?`,
    [id],
  );
}

export function resetChecklist(): void {
  db.runSync(`UPDATE checklistItems SET checked = 0`);
}

export function deleteChecklistItem(id: string): void {
  db.runSync(`DELETE FROM checklistItems WHERE id = ?`, [id]);
}
