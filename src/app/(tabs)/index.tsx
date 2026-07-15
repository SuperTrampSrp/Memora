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
import { QuickAddModal } from "../../components/QuickAddModal";
import { SectionHeader } from "../../components/SectionHeader";
import { useChecklistStore } from "../../store/checklistStore";
import { useHabitStore } from "../../store/habitStore";
import { useSocialEventStore } from "../../store/socialEventStore";
import { useTaskStore } from "../../store/taskStore";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function TodayScreen() {
  const { habits, loadHabits, toggleHabit, removeHabit } = useHabitStore();
  const { items, loadItems, addItem, toggleItem, resetAll, removeItem } =
    useChecklistStore();
  const { todayTasks, loadTasks, toggleTask, removeTask } = useTaskStore();
  const { upcomingEvents, loadEvents } = useSocialEventStore();
  const [showAddChecklist, setShowAddChecklist] = useState(false);

  useEffect(() => {
    loadHabits();
    loadItems();
    loadTasks();
    loadEvents();
  }, []);

  function handleToggleHabit(id: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleHabit(id);
  }

  function handleToggleChecklist(id: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleItem(id);
  }

  function handleDeleteHabit(id: string, title: string) {
    Alert.alert(
      `Delete "${title}"?`,
      "This will remove the habit and its streak.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => removeHabit(id),
        },
      ],
    );
  }

  function handleDeleteChecklistItem(id: string, title: string) {
    Alert.alert(`Remove "${title}"?`, "", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => removeItem(id) },
    ]);
  }

  function handleResetChecklist() {
    Alert.alert("Reset checklist?", "This will uncheck all items.", [
      { text: "Cancel", style: "cancel" },
      { text: "Reset", onPress: () => resetAll() },
    ]);
  }

  const completedHabits = habits.filter((h) => h.completedToday).length;
  const checkedItems = items.filter((i) => i.checked).length;
  const allChecked = items.length > 0 && checkedItems === items.length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting()} 👋</Text>
            <Text style={styles.title}>Today</Text>
          </View>
          <Text style={styles.date}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>

        {/* ── HABITS ── */}
        <View style={styles.section}>
          <SectionHeader
            title="Habits"
            count={
              habits.length > 0
                ? `${completedHabits}/${habits.length}`
                : undefined
            }
          />

          {habits.length > 0 && (
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(completedHabits / habits.length) * 100}%` as any,
                  },
                ]}
              />
            </View>
          )}

          {habits.map((habit) => (
            <TouchableOpacity
              key={habit.id}
              style={[styles.card, habit.completedToday && styles.cardDone]}
              onPress={() => handleToggleHabit(habit.id)}
              onLongPress={() => handleDeleteHabit(habit.id, habit.title)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  habit.completedToday && styles.checkboxDone,
                ]}
              >
                {habit.completedToday && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <Text style={styles.cardEmoji}>{habit.emoji}</Text>
              <Text
                style={[
                  styles.cardTitle,
                  habit.completedToday && styles.cardTitleDone,
                ]}
              >
                {habit.title}
              </Text>
              {habit.streak > 0 && (
                <View style={styles.streakBadge}>
                  <Text style={styles.streakText}>🔥 {habit.streak}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}

          {habits.length === 0 && (
            <EmptyState
              text="No habits yet"
              subText="Add one to start building your routine"
            />
          )}

          <AddButton
            label="+ Add habit"
            onPress={() => router.push("/add-habit")}
          />
        </View>

        {/* ── LEAVE HOME CHECKLIST ── */}
        <View style={styles.section}>
          <SectionHeader
            title="Before you leave"
            count={
              items.length > 0 ? `${checkedItems}/${items.length}` : undefined
            }
            actionLabel={items.length > 0 ? "Reset" : undefined}
            onAction={handleResetChecklist}
          />

          {allChecked && items.length > 0 && (
            <View style={styles.allDoneBanner}>
              <Text style={styles.allDoneText}>✅ You're good to go!</Text>
            </View>
          )}

          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, !!item.checked && styles.cardDone]}
              onPress={() => handleToggleChecklist(item.id)}
              onLongPress={() => handleDeleteChecklistItem(item.id, item.title)}
              activeOpacity={0.7}
            >
              <View
                style={[styles.checkbox, !!item.checked && styles.checkboxDone]}
              >
                {!!item.checked && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text
                style={[
                  styles.cardTitle,
                  !!item.checked && styles.cardTitleDone,
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}

          {items.length === 0 && (
            <EmptyState
              text="No items yet"
              subText="Add things you always need before leaving home"
            />
          )}

          <AddButton
            label="+ Add item"
            onPress={() => setShowAddChecklist(true)}
          />
        </View>

        {/* ── TASKS DUE TODAY ── */}
        {todayTasks.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title="Due Today"
              count={`${todayTasks.filter((t) => !t.completed).length} pending`}
            />
            {todayTasks.map((task) => {
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
                  style={[
                    styles.card,
                    done && styles.cardDone,
                    { paddingLeft: 0, overflow: "hidden" },
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    toggleTask(task.id);
                  }}
                  onLongPress={() => {
                    Alert.alert(`Delete "${task.title}"?`, "", [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: () => removeTask(task.id),
                      },
                    ]);
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    style={{
                      width: 4,
                      alignSelf: "stretch",
                      backgroundColor: priorityColor,
                    }}
                  />
                  <View
                    style={[
                      styles.checkbox,
                      done && styles.checkboxDone,
                      { marginLeft: 12 },
                    ]}
                  >
                    {done && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text
                    style={[styles.cardTitle, done && styles.cardTitleDone]}
                  >
                    {task.title}
                  </Text>
                  {!!task.dueTime && (
                    <Text style={{ fontSize: 11, color: "#555" }}>
                      🕐 {task.dueTime}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* ── UPCOMING SOCIAL EVENTS ── */}
        {upcomingEvents.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Coming Up" />
            {upcomingEvents.map((event) => {
              const typeEmoji =
                event.type === "birthday"
                  ? "🎂"
                  : event.type === "anniversary"
                    ? "💍"
                    : event.type === "festival"
                      ? "🎉"
                      : "📅";
              const urgencyColor =
                event.daysUntil === 0
                  ? "#f87171"
                  : event.daysUntil <= 3
                    ? "#fb923c"
                    : "#a78bfa";

              return (
                <View key={event.id} style={styles.card}>
                  <Text style={{ fontSize: 22 }}>{typeEmoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{event.title}</Text>
                    {!!event.person && (
                      <Text style={{ fontSize: 12, color: "#555" }}>
                        {event.person}
                      </Text>
                    )}
                  </View>
                  <View
                    style={[
                      styles.streakBadge,
                      { backgroundColor: `${urgencyColor}20` },
                    ]}
                  >
                    <Text style={[styles.streakText, { color: urgencyColor }]}>
                      {event.daysUntil === 0
                        ? "🎉 Today"
                        : `${event.daysUntil}d`}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* More sections coming soon */}
        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonText}>Logs journal coming next ✦</Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Quick add modal */}
      <QuickAddModal
        visible={showAddChecklist}
        placeholder="e.g. Keys, Phone, Wallet..."
        onAdd={addItem}
        onClose={() => setShowAddChecklist(false)}
      />
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
  greeting: { fontSize: 13, color: "#555", letterSpacing: 0.4 },
  title: { fontSize: 32, fontWeight: "700", color: "#fff", marginTop: 2 },
  date: { fontSize: 12, color: "#444", marginTop: 6 },

  section: {
    paddingHorizontal: 20,
    marginTop: 28,
  },

  progressBar: {
    height: 3,
    backgroundColor: "#1e1e1e",
    borderRadius: 2,
    marginBottom: 14,
  },
  progressFill: { height: 3, backgroundColor: "#a78bfa", borderRadius: 2 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161616",
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#1e1e1e",
    gap: 10,
  },
  cardDone: { borderColor: "#2a2040", backgroundColor: "#131020" },
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
  cardEmoji: { fontSize: 18 },
  cardTitle: { flex: 1, fontSize: 15, color: "#ddd", fontWeight: "500" },
  cardTitleDone: { color: "#555", textDecorationLine: "line-through" },

  streakBadge: {
    backgroundColor: "#1e1a10",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "#2a2010",
  },
  streakText: { fontSize: 11, color: "#f59e0b" },

  allDoneBanner: {
    backgroundColor: "#0f1f0f",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1a3a1a",
  },
  allDoneText: { color: "#4ade80", fontSize: 14, fontWeight: "600" },

  comingSoon: {
    marginHorizontal: 20,
    marginTop: 32,
    padding: 16,
    backgroundColor: "#111",
    borderRadius: 14,
  },
  comingSoonText: { fontSize: 12, color: "#333", textAlign: "center" },
});
