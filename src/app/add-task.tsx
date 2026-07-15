import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DatePicker } from "../components/DatePicker";
import { useTaskStore } from "../store/taskStore";
import { TaskPriority } from "../types";

const PRIORITIES: {
  label: string;
  value: TaskPriority;
  color: string;
  emoji: string;
}[] = [
  { label: "High", value: "high", color: "#f87171", emoji: "🔴" },
  { label: "Medium", value: "medium", color: "#fb923c", emoji: "🟠" },
  { label: "Low", value: "low", color: "#4ade80", emoji: "🟢" },
];

const TIME_SLOTS = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

export default function AddTaskScreen() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [dueTime, setDueTime] = useState<string | null>(null);
  const { addTask } = useTaskStore();

  function handleSave() {
    if (!title.trim()) {
      Alert.alert("Oops", "Please enter a task name.");
      return;
    }

    addTask({
      title: title.trim(),
      notes: notes.trim() || null,
      priority,
      dueDate: dueDate ? dueDate.toISOString().split("T")[0] : null,
      dueTime,
    });
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>New Task</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.save}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.label}>Task name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Send project proposal"
          placeholderTextColor="#444"
          value={title}
          onChangeText={setTitle}
          autoFocus
        />

        {/* Notes */}
        <Text style={styles.label}>
          Notes <Text style={styles.optional}>(optional)</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Add details..."
          placeholderTextColor="#444"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />

        {/* Priority */}
        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityRow}>
          {PRIORITIES.map((p) => (
            <TouchableOpacity
              key={p.value}
              style={[
                styles.priorityCard,
                priority === p.value && {
                  borderColor: p.color,
                  backgroundColor: `${p.color}15`,
                },
              ]}
              onPress={() => setPriority(p.value)}
            >
              <Text style={styles.priorityEmoji}>{p.emoji}</Text>
              <Text
                style={[
                  styles.priorityLabel,
                  priority === p.value && { color: p.color },
                ]}
              >
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Due date */}
        <Text style={styles.label}>
          Due date <Text style={styles.optional}>(optional)</Text>
        </Text>
        <DatePicker
          value={dueDate}
          onChange={setDueDate}
          placeholder="Select due date"
        />

        {/* Due time */}
        <Text style={styles.label}>
          Due time <Text style={styles.optional}>(optional)</Text>
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.timeScroll}
        >
          {/* Clear option */}
          <TouchableOpacity
            style={[styles.timeChip, dueTime === null && styles.timeChipActive]}
            onPress={() => setDueTime(null)}
          >
            <Text
              style={[
                styles.timeChipText,
                dueTime === null && styles.timeChipTextActive,
              ]}
            >
              None
            </Text>
          </TouchableOpacity>

          {TIME_SLOTS.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.timeChip, dueTime === t && styles.timeChipActive]}
              onPress={() => setDueTime(t)}
            >
              <Text
                style={[
                  styles.timeChipText,
                  dueTime === t && styles.timeChipTextActive,
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f", paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  heading: { fontSize: 17, fontWeight: "600", color: "#fff" },
  cancel: { fontSize: 15, color: "#666" },
  save: { fontSize: 15, color: "#a78bfa", fontWeight: "600" },
  label: {
    fontSize: 12,
    color: "#555",
    marginTop: 24,
    marginBottom: 10,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  optional: { color: "#333", textTransform: "none", letterSpacing: 0 },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#fff",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#222",
  },
  notesInput: {
    height: 90,
    textAlignVertical: "top",
  },
  priorityRow: { flexDirection: "row", gap: 8 },
  priorityCard: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#222",
    alignItems: "center",
    gap: 6,
  },
  priorityEmoji: { fontSize: 20 },
  priorityLabel: { fontSize: 13, fontWeight: "600", color: "#555" },
  timeScroll: { marginBottom: 8 },
  timeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#222",
    marginRight: 8,
  },
  timeChipActive: { backgroundColor: "#1e1a2e", borderColor: "#a78bfa" },
  timeChipText: { color: "#555", fontSize: 14 },
  timeChipTextActive: { color: "#a78bfa", fontWeight: "600" },
});
