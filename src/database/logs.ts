import { LogEntry } from "../types";
import db from "./index";

export function getAllLogs(): LogEntry[] {
  return db.getAllSync(
    `SELECT * FROM logEntries ORDER BY startDate DESC`,
  ) as LogEntry[];
}

export function searchLogs(query: string): LogEntry[] {
  return db.getAllSync(
    `SELECT * FROM logEntries
     WHERE title LIKE ?
        OR description LIKE ?
        OR person LIKE ?
     ORDER BY startDate DESC`,
    [`%${query}%`, `%${query}%`, `%${query}%`],
  ) as LogEntry[];
}

export function createLog(log: Omit<LogEntry, "id" | "createdAt">): LogEntry {
  const id = Math.random().toString(36).slice(2) + Date.now();
  const createdAt = new Date().toISOString();

  db.runSync(
    `INSERT INTO logEntries
       (id, type, title, description, person, startDate, endDate, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      log.type,
      log.title,
      log.description ?? null,
      log.person ?? null,
      log.startDate,
      log.endDate ?? null,
      createdAt,
    ],
  );

  return { ...log, id, createdAt };
}

export function deleteLog(id: string): void {
  db.runSync(`DELETE FROM logEntries WHERE id = ?`, [id]);
}
