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
import { useHabitStore } from "../store/habitStore";
import { HabitFrequency } from "../types";

const EMOJIS = [
  "☀️",
  "💧",
  "🏃",
  "📚",
  "🧘",
  "💊",
  "🥗",
  "😴",
  "🧹",
  "✍️",
  "🎯",
  "💪",
];
const FREQUENCIES: { label: string; value: HabitFrequency }[] = [
  { label: "Daily", value: "daily" },
  { label: "Weekdays", value: "weekdays" },
  { label: "Weekends", value: "weekends" },
];

export default function AddHabitScreen() {
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("☀️");
  const [frequency, setFrequency] = useState<HabitFrequency>("daily");
  const [reminderTime, setReminderTime] = useState("");
  const { addHabit } = useHabitStore();

  function handleSave() {
    if (!title.trim()) {
      Alert.alert("Oops", "Please enter a habit name.");
      return;
    }
    addHabit({
      title: title.trim(),
      emoji,
      frequency,
      reminderTime: reminderTime || null,
    });
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>New Habit</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.save}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Emoji picker */}
        <Text style={styles.label}>Pick an icon</Text>
        <View style={styles.emojiGrid}>
          {EMOJIS.map((e) => (
            <TouchableOpacity
              key={e}
              style={[styles.emojiBtn, emoji === e && styles.emojiBtnActive]}
              onPress={() => setEmoji(e)}
            >
              <Text style={styles.emojiText}>{e}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Title */}
        <Text style={styles.label}>Habit name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Drink morning water"
          placeholderTextColor="#444"
          value={title}
          onChangeText={setTitle}
          autoFocus
        />

        {/* Frequency */}
        <Text style={styles.label}>Frequency</Text>
        <View style={styles.row}>
          {FREQUENCIES.map((f) => (
            <TouchableOpacity
              key={f.value}
              style={[styles.chip, frequency === f.value && styles.chipActive]}
              onPress={() => setFrequency(f.value)}
            >
              <Text
                style={[
                  styles.chipText,
                  frequency === f.value && styles.chipTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Reminder time */}
        <Text style={styles.label}>
          Reminder time <Text style={styles.optional}>(optional)</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 07:00"
          placeholderTextColor="#444"
          value={reminderTime}
          onChangeText={setReminderTime}
          keyboardType="numbers-and-punctuation"
        />

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
  optional: { color: "#333", textTransform: "none" },
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
  emojiGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  emojiBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#222",
  },
  emojiBtnActive: { borderColor: "#a78bfa", backgroundColor: "#1e1a2e" },
  emojiText: { fontSize: 24 },
  row: { flexDirection: "row", gap: 10 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#222",
  },
  chipActive: { backgroundColor: "#1e1a2e", borderColor: "#a78bfa" },
  chipText: { color: "#555", fontSize: 14 },
  chipTextActive: { color: "#a78bfa", fontWeight: "600" },
});
