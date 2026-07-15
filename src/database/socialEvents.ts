import { SocialEvent } from "../types";
import db from "./index";

function getDaysUntilNextOccurrence(dateStr: string): number {
  const today = new Date();
  const [month, day] = dateStr.split("-").map(Number);

  let next = new Date(today.getFullYear(), month - 1, day);
  if (next < today) {
    next = new Date(today.getFullYear() + 1, month - 1, day);
  }

  const diff = next.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getAllSocialEvents(): SocialEvent[] {
  return db.getAllSync(
    `SELECT * FROM socialEvents ORDER BY date ASC`,
  ) as SocialEvent[];
}

export function getUpcomingSocialEvents(withinDays = 30): SocialEvent[] {
  const all = getAllSocialEvents();
  return all
    .map((e) => ({ ...e, daysUntil: getDaysUntilNextOccurrence(e.date) }))
    .filter((e) => e.daysUntil <= withinDays)
    .sort((a, b) => a.daysUntil - b.daysUntil);
}

export function createSocialEvent(
  event: Omit<SocialEvent, "id" | "createdAt">,
): SocialEvent {
  const id = Math.random().toString(36).slice(2) + Date.now();
  const createdAt = new Date().toISOString();

  db.runSync(
    `INSERT INTO socialEvents
       (id, title, person, type, date, reminderDaysBefore, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      event.title,
      event.person ?? null,
      event.type,
      event.date,
      event.reminderDaysBefore,
      createdAt,
    ],
  );

  return { ...event, id, createdAt };
}

export function deleteSocialEvent(id: string): void {
  db.runSync(`DELETE FROM socialEvents WHERE id = ?`, [id]);
}

export { getDaysUntilNextOccurrence };
