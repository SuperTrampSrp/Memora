import { Bill, BillFrequency } from "../types";
import db from "./index";

function getNextDueDate(currentDue: string, frequency: BillFrequency): string {
  const date = new Date(currentDue);
  switch (frequency) {
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "yearly":
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      return currentDue;
  }
  return date.toISOString();
}

export function getAllBills(): Bill[] {
  return db.getAllSync(`SELECT * FROM bills ORDER BY dueDate ASC`) as Bill[];
}

export function getDueSoonBills(withinDays = 7): Bill[] {
  const now = new Date();
  const future = new Date();
  future.setDate(future.getDate() + withinDays);
  return db.getAllSync(
    `SELECT * FROM bills
     WHERE paid = 0
       AND dueDate BETWEEN ? AND ?
     ORDER BY dueDate ASC`,
    [now.toISOString(), future.toISOString()],
  ) as Bill[];
}

export function createBill(
  bill: Omit<Bill, "id" | "paid" | "createdAt">,
): Bill {
  const id = Math.random().toString(36).slice(2) + Date.now();
  const createdAt = new Date().toISOString();

  db.runSync(
    `INSERT INTO bills
       (id, title, amount, frequency, dueDate, reminderDaysBefore, paid, autoPay, category, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?)`,
    [
      id,
      bill.title,
      bill.amount ?? null,
      bill.frequency,
      bill.dueDate,
      bill.reminderDaysBefore,
      bill.autoPay ? 1 : 0,
      bill.category,
      createdAt,
    ],
  );

  return { ...bill, id, paid: false, createdAt };
}

export function markBillPaid(id: string): void {
  const bill = db.getFirstSync(`SELECT * FROM bills WHERE id = ?`, [
    id,
  ]) as Bill;
  if (!bill) return;

  if (bill.frequency === "one_time") {
    db.runSync(`UPDATE bills SET paid = 1 WHERE id = ?`, [id]);
  } else {
    // Roll to next cycle
    const nextDue = getNextDueDate(bill.dueDate, bill.frequency);
    db.runSync(`UPDATE bills SET paid = 0, dueDate = ? WHERE id = ?`, [
      nextDue,
      id,
    ]);
  }
}

export function deleteBill(id: string): void {
  db.runSync(`DELETE FROM bills WHERE id = ?`, [id]);
}
