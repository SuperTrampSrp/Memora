import { useTaskStore } from "@/store/taskStore";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddButton } from "../../components/AddButton";
import { EmptyState } from "../../components/EmptyState";
import { SectionHeader } from "../../components/SectionHeader";
import { getDaysUntilNextOccurrence } from "../../database/socialEvents";
import { useBillStore } from "../../store/billStore";
import { useShoppingStore } from "../../store/shoppingStore";
import { useSocialEventStore } from "../../store/socialEventStore";
import { ShoppingCategory, ShoppingItem } from "../../types";

const PRIORITY_CONFIG = {
  urgent: { label: "Urgent", color: "#f87171", bg: "#2a1010" },
  necessary: { label: "Necessary", color: "#a78bfa", bg: "#1e1a2e" },
  can_skip: { label: "Can Skip", color: "#555", bg: "#1a1a1a" },
};

const CATEGORY_EMOJI: Record<ShoppingCategory, string> = {
  grocery: "🛒",
  vegetable: "🥦",
  fruit: "🍎",
  dairy: "🥛",
  meat: "🥩",
  medicine: "💊",
  electronics: "🔌",
  household: "🏠",
  clothing: "👕",
  other: "📦",
};

function PriorityTag({ priority }: { priority: keyof typeof PRIORITY_CONFIG }) {
  const config = PRIORITY_CONFIG[priority];
  return (
    <View style={[styles.priorityTag, { backgroundColor: config.bg }]}>
      <Text style={[styles.priorityTagText, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
}

function groupByCategory(items: ShoppingItem[]) {
  const groups: Record<string, ShoppingItem[]> = {};
  items.forEach((item) => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });
  return groups;
}

function getDaysUntil(dateStr: string): number {
  const due = new Date(dateStr);
  const now = new Date();
  const diff = due.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function DueBadge({ daysUntil }: { daysUntil: number }) {
  const color =
    daysUntil <= 1 ? "#f87171" : daysUntil <= 3 ? "#fb923c" : "#a78bfa";
  const label =
    daysUntil < 0
      ? "Overdue"
      : daysUntil === 0
        ? "Due today"
        : daysUntil === 1
          ? "Due tomorrow"
          : `${daysUntil}d left`;

  return (
    <View style={[billStyles.dueBadge, { backgroundColor: `${color}20` }]}>
      <Text style={[billStyles.dueBadgeText, { color }]}>{label}</Text>
    </View>
  );
}

export default function ListsScreen() {
  const { items, boughtItems, loadItems, toggleItem, removeItem, clearBought } =
    useShoppingStore();
  const { bills, loadBills, payBill, removeBill } = useBillStore();
  const { tasks, loadTasks, toggleTask, removeTask } = useTaskStore();
  const { events, loadEvents, removeEvent } = useSocialEventStore();
  const [showBought, setShowBought] = useState(false);

  useEffect(() => {
    loadItems();
    loadBills();
    loadTasks();
    loadEvents();
  }, []);

  function handleToggle(id: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleItem(id);
  }

  function handleDelete(id: string, title: string) {
    Alert.alert(`Remove "${title}"?`, "", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => removeItem(id) },
    ]);
  }

  function handleClearBought() {
    Alert.alert(
      "Clear bought items?",
      "This will permanently remove all bought items.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: () => clearBought() },
      ],
    );
  }

  const grouped = groupByCategory(items);

  function handlePayBill(id: string, title: string) {
    Alert.alert(`Mark "${title}" as paid?`, "", [
      { text: "Cancel", style: "cancel" },
      { text: "Mark Paid", onPress: () => payBill(id) },
    ]);
  }

  function handleDeleteBill(id: string, title: string) {
    Alert.alert(`Delete "${title}"?`, "", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => removeBill(id) },
    ]);
  }

  function handleToggleTask(id: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTask(id);
  }

  function handleDeleteTask(id: string, title: string) {
    Alert.alert(`Delete "${title}"?`, "", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => removeTask(id) },
    ]);
  }

  function handleDeleteEvent(id: string, title: string) {
    Alert.alert(`Delete "${title}"?`, "", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => removeEvent(id) },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Lists</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>

        {/* ── SHOPPING ── */}
        <View style={styles.section}>
          <SectionHeader
            title="Shopping"
            count={items.length > 0 ? `${items.length} items` : undefined}
          />

          {items.length === 0 && (
            <EmptyState
              text="Nothing to buy"
              subText="Add items you need to pick up"
            />
          )}

          {/* Grouped by category */}
          {Object.entries(grouped).map(([cat, catItems]) => (
            <View key={cat} style={styles.categoryGroup}>
              <Text style={styles.categoryHeading}>
                {CATEGORY_EMOJI[cat as ShoppingCategory]}{" "}
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
              {catItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.shoppingCard}
                  onPress={() => handleToggle(item.id)}
                  onLongPress={() => handleDelete(item.id, item.title)}
                  activeOpacity={0.7}
                >
                  <View style={styles.shoppingLeft}>
                    <View style={styles.shoppingCheck} />
                    <View>
                      <Text style={styles.shoppingTitle}>{item.title}</Text>
                      {!!item.quantity && (
                        <Text style={styles.shoppingQty}>{item.quantity}</Text>
                      )}
                    </View>
                  </View>
                  <PriorityTag priority={item.priority} />
                </TouchableOpacity>
              ))}
            </View>
          ))}

          <AddButton
            label="+ Add item"
            onPress={() => router.push("/add-shopping")}
          />
        </View>

        {/* ── BOUGHT ── */}
        {boughtItems.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title={`Bought (${boughtItems.length})`}
              actionLabel="Clear all"
              onAction={handleClearBought}
            />
            <TouchableOpacity
              style={styles.toggleBought}
              onPress={() => setShowBought((v) => !v)}
            >
              <Text style={styles.toggleBoughtText}>
                {showBought ? "▲ Hide" : "▼ Show"} bought items
              </Text>
            </TouchableOpacity>

            {showBought &&
              boughtItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.shoppingCard, styles.boughtCard]}
                  onPress={() => handleToggle(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.shoppingLeft}>
                    <View
                      style={[styles.shoppingCheck, styles.shoppingCheckDone]}
                    >
                      <Text style={styles.checkmark}>✓</Text>
                    </View>
                    <Text style={styles.boughtTitle}>{item.title}</Text>
                  </View>
                  <PriorityTag priority={item.priority} />
                </TouchableOpacity>
              ))}
          </View>
        )}

        {/* ── BILLS & SUBSCRIPTIONS ── */}
        <View style={styles.section}>
          <SectionHeader
            title="Bills & Subscriptions"
            count={bills.length > 0 ? `${bills.length} total` : undefined}
          />

          {bills.length === 0 && (
            <EmptyState
              text="No bills added"
              subText="Track your recurring payments here"
            />
          )}

          {bills.map((bill) => {
            const daysUntil = getDaysUntil(bill.dueDate);
            return (
              <TouchableOpacity
                key={bill.id}
                style={[
                  billStyles.billCard,
                  !!bill.paid && billStyles.billCardPaid,
                ]}
                onPress={() => handlePayBill(bill.id, bill.title)}
                onLongPress={() => handleDeleteBill(bill.id, bill.title)}
                activeOpacity={0.7}
              >
                <View style={billStyles.billLeft}>
                  <Text style={billStyles.billTitle}>{bill.title}</Text>
                  <View style={billStyles.billMeta}>
                    <Text style={billStyles.billCategory}>{bill.category}</Text>
                    <Text style={billStyles.billDot}>·</Text>
                    <Text style={billStyles.billFreq}>
                      {bill.frequency.replace("_", " ")}
                    </Text>
                    {!!bill.autoPay && (
                      <>
                        <Text style={billStyles.billDot}>·</Text>
                        <Text style={billStyles.autoPayText}>Auto pay</Text>
                      </>
                    )}
                  </View>
                </View>
                <View style={billStyles.billRight}>
                  {!!bill.amount && (
                    <Text style={billStyles.billAmount}>₹{bill.amount}</Text>
                  )}
                  {!bill.paid && <DueBadge daysUntil={daysUntil} />}
                  {!!bill.paid && (
                    <View style={billStyles.paidBadge}>
                      <Text style={billStyles.paidText}>✓ Paid</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}

          <AddButton
            label="+ Add bill"
            onPress={() => router.push("/add-bill")}
          />
        </View>

        {/* ── TASKS ── */}
        <View style={styles.section}>
          <SectionHeader
            title="Tasks"
            count={
              tasks.length > 0
                ? `${tasks.filter((t) => !t.completed).length} pending`
                : undefined
            }
          />

          {tasks.length === 0 && (
            <EmptyState
              text="No tasks yet"
              subText="Add things you need to get done"
            />
          )}

          {tasks.map((task) => {
            const done = !!task.completed;
            const priorityColor =
              task.priority === "high"
                ? "#f87171"
                : task.priority === "medium"
                  ? "#fb923c"
                  : "#4ade80";

            return (
              <TouchableOpacity
                key={task.id}
                style={[taskStyles.taskCard, done && taskStyles.taskCardDone]}
                onPress={() => handleToggleTask(task.id)}
                onLongPress={() => handleDeleteTask(task.id, task.title)}
                activeOpacity={0.7}
              >
                {/* Priority stripe */}
                <View
                  style={[
                    taskStyles.stripe,
                    { backgroundColor: priorityColor },
                  ]}
                />

                <View
                  style={[taskStyles.checkbox, done && taskStyles.checkboxDone]}
                >
                  {done && <Text style={taskStyles.checkmark}>✓</Text>}
                </View>

                <View style={taskStyles.taskBody}>
                  <Text
                    style={[
                      taskStyles.taskTitle,
                      done && taskStyles.taskTitleDone,
                    ]}
                  >
                    {task.title}
                  </Text>
                  {!!task.notes && (
                    <Text style={taskStyles.taskNotes} numberOfLines={1}>
                      {task.notes}
                    </Text>
                  )}
                  <View style={taskStyles.taskMeta}>
                    {!!task.dueDate && (
                      <Text style={taskStyles.taskDate}>📅 {task.dueDate}</Text>
                    )}
                    {!!task.dueTime && (
                      <Text style={taskStyles.taskTime}>🕐 {task.dueTime}</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          <AddButton
            label="+ Add task"
            onPress={() => router.push("/add-task")}
          />
        </View>

        {/* ── SOCIAL EVENTS ── */}
        <View style={styles.section}>
          <SectionHeader
            title="Social Events"
            count={events.length > 0 ? `${events.length} total` : undefined}
          />

          {events.length === 0 && (
            <EmptyState
              text="No events added"
              subText="Add birthdays, anniversaries & festivals"
            />
          )}

          {events.map((event) => {
            const daysUntil = getDaysUntilNextOccurrence(event.date);
            const typeEmoji =
              event.type === "birthday"
                ? "🎂"
                : event.type === "anniversary"
                  ? "💍"
                  : event.type === "festival"
                    ? "🎉"
                    : "📅";

            const urgencyColor =
              daysUntil === 0
                ? "#f87171"
                : daysUntil <= 3
                  ? "#fb923c"
                  : daysUntil <= 7
                    ? "#facc15"
                    : "#a78bfa";

            const daysLabel =
              daysUntil === 0
                ? "🎉 Today!"
                : daysUntil === 1
                  ? "Tomorrow"
                  : `${daysUntil}d away`;

            return (
              <TouchableOpacity
                key={event.id}
                style={socialStyles.eventCard}
                onLongPress={() => handleDeleteEvent(event.id, event.title)}
                activeOpacity={0.7}
              >
                <Text style={socialStyles.eventEmoji}>{typeEmoji}</Text>
                <View style={socialStyles.eventBody}>
                  <Text style={socialStyles.eventTitle}>{event.title}</Text>
                  {!!event.person && (
                    <Text style={socialStyles.eventPerson}>{event.person}</Text>
                  )}
                  <Text style={socialStyles.eventDate}>
                    Every{" "}
                    {new Date(
                      2024,
                      parseInt(event.date.split("-")[0]) - 1,
                      1,
                    ).toLocaleString("default", { month: "long" })}{" "}
                    {event.date.split("-")[1]}
                  </Text>
                </View>
                <View
                  style={[
                    socialStyles.daysBadge,
                    { backgroundColor: `${urgencyColor}20` },
                  ]}
                >
                  <Text
                    style={[socialStyles.daysText, { color: urgencyColor }]}
                  >
                    {daysLabel}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          <AddButton
            label="+ Add event"
            onPress={() => router.push("/add-social-event")}
          />
        </View>

        {/* More coming soon */}
        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonText}>
            Bills, Tasks & Social Events coming next ✦
          </Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: { fontSize: 32, fontWeight: "700", color: "#fff", marginTop: 2 },
  date: { fontSize: 12, color: "#444", marginTop: 8 },

  section: { paddingHorizontal: 20, marginTop: 28 },

  categoryGroup: { marginBottom: 16 },
  categoryHeading: {
    fontSize: 12,
    color: "#555",
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 8,
  },

  shoppingCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#161616",
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#1e1e1e",
  },
  boughtCard: { opacity: 0.5 },
  shoppingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  shoppingCheck: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  shoppingCheckDone: { backgroundColor: "#a78bfa", borderColor: "#a78bfa" },
  checkmark: { color: "#fff", fontSize: 13, fontWeight: "700" },
  shoppingTitle: { fontSize: 15, color: "#ddd", fontWeight: "500" },
  shoppingQty: { fontSize: 12, color: "#555", marginTop: 2 },
  boughtTitle: {
    fontSize: 14,
    color: "#444",
    textDecorationLine: "line-through",
  },

  priorityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityTagText: { fontSize: 11, fontWeight: "600" },

  toggleBought: { paddingVertical: 10, alignItems: "center" },
  toggleBoughtText: { fontSize: 13, color: "#444" },

  comingSoon: {
    marginHorizontal: 20,
    marginTop: 32,
    padding: 16,
    backgroundColor: "#111",
    borderRadius: 14,
  },
  comingSoonText: { fontSize: 12, color: "#333", textAlign: "center" },
});

const billStyles = StyleSheet.create({
  billCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#161616",
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#1e1e1e",
  },
  billCardPaid: { opacity: 0.4 },
  billLeft: { flex: 1, gap: 4 },
  billTitle: { fontSize: 15, color: "#ddd", fontWeight: "500" },
  billMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  billCategory: { fontSize: 11, color: "#444" },
  billDot: { fontSize: 11, color: "#333" },
  billFreq: { fontSize: 11, color: "#444", textTransform: "capitalize" },
  autoPayText: { fontSize: 11, color: "#4ade80" },
  billRight: { alignItems: "flex-end", gap: 6 },
  billAmount: { fontSize: 15, color: "#fff", fontWeight: "600" },
  dueBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  dueBadgeText: { fontSize: 11, fontWeight: "600" },
  paidBadge: {
    backgroundColor: "#0f1f0f",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  paidText: { fontSize: 11, color: "#4ade80", fontWeight: "600" },
});

const taskStyles = StyleSheet.create({
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161616",
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#1e1e1e",
    overflow: "hidden",
    gap: 12,
    paddingRight: 14,
  },
  taskCardDone: { opacity: 0.4 },
  stripe: { width: 4, alignSelf: "stretch" },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: { backgroundColor: "#a78bfa", borderColor: "#a78bfa" },
  checkmark: { color: "#fff", fontSize: 13, fontWeight: "700" },
  taskBody: { flex: 1, paddingVertical: 14 },
  taskTitle: { fontSize: 15, color: "#ddd", fontWeight: "500" },
  taskTitleDone: { color: "#555", textDecorationLine: "line-through" },
  taskNotes: { fontSize: 12, color: "#444", marginTop: 2 },
  taskMeta: { flexDirection: "row", gap: 10, marginTop: 6 },
  taskDate: { fontSize: 11, color: "#555" },
  taskTime: { fontSize: 11, color: "#555" },
});

const socialStyles = StyleSheet.create({
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161616",
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#1e1e1e",
    gap: 12,
  },
  eventEmoji: { fontSize: 28 },
  eventBody: { flex: 1, gap: 2 },
  eventTitle: { fontSize: 15, color: "#ddd", fontWeight: "500" },
  eventPerson: { fontSize: 12, color: "#555" },
  eventDate: { fontSize: 11, color: "#444", marginTop: 2 },
  daysBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  daysText: { fontSize: 11, fontWeight: "700" },
});
