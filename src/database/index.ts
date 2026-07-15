import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("memora.db");

export function initDatabase() {
  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      emoji TEXT NOT NULL DEFAULT '✅',
      frequency TEXT NOT NULL DEFAULT 'daily',
      reminderTime TEXT,
      streak INTEGER NOT NULL DEFAULT 0,
      longestStreak INTEGER NOT NULL DEFAULT 0,
      completedToday INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS habitLogs (
      id TEXT PRIMARY KEY,
      habitId TEXT NOT NULL,
      completedAt TEXT NOT NULL,
      FOREIGN KEY (habitId) REFERENCES habits(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS checklistItems (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      checked INTEGER NOT NULL DEFAULT 0,
      sortOrder INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS shoppingItems (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'other',
      priority TEXT NOT NULL DEFAULT 'necessary',
      quantity TEXT,
      bought INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bills (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      amount REAL,
      frequency TEXT NOT NULL DEFAULT 'monthly',
      dueDate TEXT NOT NULL,
      reminderDaysBefore INTEGER NOT NULL DEFAULT 3,
      paid INTEGER NOT NULL DEFAULT 0,
      autoPay INTEGER NOT NULL DEFAULT 0,
      category TEXT NOT NULL DEFAULT 'other',
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      notes TEXT,
      priority TEXT NOT NULL DEFAULT 'medium',
      dueDate TEXT,
      dueTime TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS socialEvents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      person TEXT,
      type TEXT NOT NULL DEFAULT 'other',
      date TEXT NOT NULL,
      reminderDaysBefore INTEGER NOT NULL DEFAULT 3,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS logEntries (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL DEFAULT 'note',
      title TEXT NOT NULL,
      description TEXT,
      person TEXT,
      startDate TEXT NOT NULL,
      endDate TEXT,
      createdAt TEXT NOT NULL
    );
  `);
}

export default db;
