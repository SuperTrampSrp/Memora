import { ShoppingItem } from "../types";
import db from "./index";

export function getAllShoppingItems(): ShoppingItem[] {
  return db.getAllSync(
    `SELECT * FROM shoppingItems WHERE bought = 0 ORDER BY
      CASE priority
        WHEN 'urgent' THEN 1
        WHEN 'necessary' THEN 2
        WHEN 'can_skip' THEN 3
      END, createdAt ASC`,
  ) as ShoppingItem[];
}

export function getBoughtItems(): ShoppingItem[] {
  return db.getAllSync(
    `SELECT * FROM shoppingItems WHERE bought = 1 ORDER BY createdAt DESC`,
  ) as ShoppingItem[];
}

export function createShoppingItem(
  item: Omit<ShoppingItem, "id" | "bought" | "createdAt">,
): ShoppingItem {
  const id = Math.random().toString(36).slice(2) + Date.now();
  const createdAt = new Date().toISOString();

  db.runSync(
    `INSERT INTO shoppingItems (id, title, category, priority, quantity, bought, createdAt)
     VALUES (?, ?, ?, ?, ?, 0, ?)`,
    [
      id,
      item.title,
      item.category,
      item.priority,
      item.quantity ?? null,
      createdAt,
    ],
  );

  return { ...item, id, bought: false, createdAt };
}

export function toggleShoppingItem(id: string): void {
  db.runSync(
    `UPDATE shoppingItems SET bought = CASE WHEN bought = 1 THEN 0 ELSE 1 END WHERE id = ?`,
    [id],
  );
}

export function deleteShoppingItem(id: string): void {
  db.runSync(`DELETE FROM shoppingItems WHERE id = ?`, [id]);
}

export function clearBoughtItems(): void {
  db.runSync(`DELETE FROM shoppingItems WHERE bought = 1`);
}
