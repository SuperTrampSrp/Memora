import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { Bill, Habit, SocialEvent, Task } from "../types";

// ── Configure how notifications appear ───────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ── Request permissions ───────────────────────────────────
export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("memora", {
      name: "Memora Reminders",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#a78bfa",
      sound: "default",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

// ── Cancel a specific notification ───────────────────────
export async function cancelNotification(id: string) {
  await Notifications.cancelScheduledNotificationAsync(id);
}

// ── Cancel all notifications ──────────────────────────────
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// ── HABITS ───────────────────────────────────────────────
export async function scheduleHabitReminder(
  habit: Habit,
): Promise<string | null> {
  if (!habit.reminderTime) return null;

  const [hour, minute] = habit.reminderTime.split(":").map(Number);

  const id = await Notifications.scheduleNotificationAsync({
    identifier: `habit-${habit.id}`,
    content: {
      title: `${habit.emoji} Habit reminder`,
      body: `Time to: ${habit.title}`,
      data: { type: "habit", id: habit.id },
      sound: "default",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });

  return id;
}

export async function cancelHabitReminder(habitId: string) {
  await Notifications.cancelScheduledNotificationAsync(`habit-${habitId}`);
}

// ── BILLS ─────────────────────────────────────────────────
export async function scheduleBillReminder(bill: Bill): Promise<string | null> {
  if (bill.paid) return null;

  const dueDate = new Date(bill.dueDate);
  const reminderDate = new Date(dueDate);
  reminderDate.setDate(reminderDate.getDate() - bill.reminderDaysBefore);
  reminderDate.setHours(9, 0, 0, 0);

  if (reminderDate <= new Date()) return null;

  const id = await Notifications.scheduleNotificationAsync({
    identifier: `bill-${bill.id}`,
    content: {
      title: "💳 Bill due soon",
      body: `${bill.title} is due in ${bill.reminderDaysBefore} day${bill.reminderDaysBefore > 1 ? "s" : ""}${bill.amount ? ` — ₹${bill.amount}` : ""}`,
      data: { type: "bill", id: bill.id },
      sound: "default",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: reminderDate,
    },
  });

  return id;
}

export async function cancelBillReminder(billId: string) {
  await Notifications.cancelScheduledNotificationAsync(`bill-${billId}`);
}

// ── TASKS ─────────────────────────────────────────────────
export async function scheduleTaskReminder(task: Task): Promise<string | null> {
  if (!task.dueDate) return null;

  const [year, month, day] = task.dueDate.split("-").map(Number);
  const [hour, minute] = task.dueTime
    ? task.dueTime.split(":").map(Number)
    : [9, 0];

  const reminderDate = new Date(year, month - 1, day, hour, minute);
  if (reminderDate <= new Date()) return null;

  const priorityEmoji =
    task.priority === "high" ? "🔴" : task.priority === "medium" ? "🟠" : "🟢";

  const id = await Notifications.scheduleNotificationAsync({
    identifier: `task-${task.id}`,
    content: {
      title: `${priorityEmoji} Task due`,
      body: task.title,
      data: { type: "task", id: task.id },
      sound: "default",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: reminderDate,
    },
  });

  return id;
}

export async function cancelTaskReminder(taskId: string) {
  await Notifications.cancelScheduledNotificationAsync(`task-${taskId}`);
}

// ── SOCIAL EVENTS ─────────────────────────────────────────
export async function scheduleSocialEventReminder(
  event: SocialEvent,
): Promise<string | null> {
  const [month, day] = event.date.split("-").map(Number);

  const today = new Date();
  let eventDate = new Date(today.getFullYear(), month - 1, day);
  if (eventDate < today) {
    eventDate = new Date(today.getFullYear() + 1, month - 1, day);
  }

  const reminderDate = new Date(eventDate);
  reminderDate.setDate(reminderDate.getDate() - event.reminderDaysBefore);
  reminderDate.setHours(8, 0, 0, 0);

  if (reminderDate <= today) return null;

  const typeEmoji =
    event.type === "birthday"
      ? "🎂"
      : event.type === "anniversary"
        ? "💍"
        : event.type === "festival"
          ? "🎉"
          : "📅";

  const id = await Notifications.scheduleNotificationAsync({
    identifier: `social-${event.id}`,
    content: {
      title: `${typeEmoji} Coming up!`,
      body: `${event.title} is in ${event.reminderDaysBefore} day${event.reminderDaysBefore > 1 ? "s" : ""}`,
      data: { type: "social", id: event.id },
      sound: "default",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: reminderDate,
    },
  });

  return id;
}

export async function cancelSocialEventReminder(eventId: string) {
  await Notifications.cancelScheduledNotificationAsync(`social-${eventId}`);
}

// ── DAILY MORNING SUMMARY ─────────────────────────────────
export async function scheduleDailySummary() {
  await Notifications.cancelScheduledNotificationAsync("daily-summary");

  await Notifications.scheduleNotificationAsync({
    identifier: "daily-summary",
    content: {
      title: "☀️ Good morning!",
      body: "Tap to see your habits, tasks and reminders for today.",
      data: { type: "summary" },
      sound: "default",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 8,
      minute: 0,
    },
  });
}
