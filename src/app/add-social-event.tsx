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
import { useSocialEventStore } from "../store/socialEventStore";
import { SocialEventType } from "../types";

const EVENT_TYPES: { label: string; value: SocialEventType; emoji: string }[] =
  [
    { label: "Birthday", value: "birthday", emoji: "🎂" },
    { label: "Anniversary", value: "anniversary", emoji: "💍" },
    { label: "Festival", value: "festival", emoji: "🎉" },
    { label: "Other", value: "other", emoji: "📅" },
  ];

const REMINDER_DAYS = [1, 3, 5, 7, 14];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function AddSocialEventScreen() {
  const [person, setPerson] = useState("");
  const [type, setType] = useState<SocialEventType>("birthday");
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1,
  );
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [reminderDays, setReminderDays] = useState(3);
  const { addEvent } = useSocialEventStore();

  const daysInMonth = new Date(2024, selectedMonth, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  function handleSave() {
    if (!person.trim()) {
      Alert.alert("Oops", "Please enter a person or event name.");
      return;
    }
    const typeLabel = EVENT_TYPES.find((t) => t.value === type)?.label ?? "";
    const title = `${person.trim()}'s ${typeLabel}`;

    const mm = String(selectedMonth).padStart(2, "0");
    const dd = String(selectedDay).padStart(2, "0");

    addEvent({
      title: title.trim(),
      person: person.trim() || null,
      type,
      date: `${mm}-${dd}`,
      reminderDaysBefore: reminderDays,
    });
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>New Event</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.save}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Event type */}
        <Text style={styles.label}>Event type</Text>
        <View style={styles.typeGrid}>
          {EVENT_TYPES.map((t) => (
            <TouchableOpacity
              key={t.value}
              style={[
                styles.typeCard,
                type === t.value && styles.typeCardActive,
              ]}
              onPress={() => setType(t.value)}
            >
              <Text style={styles.typeEmoji}>{t.emoji}</Text>
              <Text
                style={[
                  styles.typeLabel,
                  type === t.value && styles.typeLabelActive,
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Person</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Mom, Rahul, Diwali..."
          placeholderTextColor="#444"
          value={person}
          onChangeText={setPerson}
          autoFocus
        />

        {/* Month picker */}
        <Text style={styles.label}>Month</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scroll}
        >
          {MONTHS.map((m, i) => (
            <TouchableOpacity
              key={m}
              style={[
                styles.monthChip,
                selectedMonth === i + 1 && styles.chipActive,
              ]}
              onPress={() => {
                setSelectedMonth(i + 1);
                setSelectedDay(1);
              }}
            >
              <Text
                style={[
                  styles.monthChipText,
                  selectedMonth === i + 1 && styles.chipTextActive,
                ]}
              >
                {m.slice(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Day picker */}
        <Text style={styles.label}>Day</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scroll}
        >
          {days.map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.dayChip, selectedDay === d && styles.chipActive]}
              onPress={() => setSelectedDay(d)}
            >
              <Text
                style={[
                  styles.dayChipText,
                  selectedDay === d && styles.chipTextActive,
                ]}
              >
                {String(d).padStart(2, "0")}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Preview */}
        <View style={styles.preview}>
          <Text style={styles.previewEmoji}>
            {EVENT_TYPES.find((t) => t.value === type)?.emoji}
          </Text>
          <Text style={styles.previewText}>
            {person
              ? `${person}'s ${EVENT_TYPES.find((t) => t.value === type)?.label}`
              : "Your event"}{" "}
            — every {String(selectedDay).padStart(2, "0")}
          </Text>
        </View>

        {/* Reminder */}
        <Text style={styles.label}>Remind me before</Text>
        <View style={styles.row}>
          {REMINDER_DAYS.map((d) => (
            <TouchableOpacity
              key={d}
              style={[
                styles.reminderChip,
                reminderDays === d && styles.chipActive,
              ]}
              onPress={() => setReminderDays(d)}
            >
              <Text
                style={[
                  styles.reminderChipText,
                  reminderDays === d && styles.chipTextActive,
                ]}
              >
                {d}d
              </Text>
            </TouchableOpacity>
          ))}
        </View>

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
  typeGrid: { flexDirection: "row", gap: 8 },
  typeCard: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#222",
    alignItems: "center",
    gap: 6,
  },
  typeCardActive: { borderColor: "#a78bfa", backgroundColor: "#1e1a2e" },
  typeEmoji: { fontSize: 22 },
  typeLabel: { fontSize: 11, color: "#555", fontWeight: "500" },
  typeLabelActive: { color: "#a78bfa", fontWeight: "600" },
  scroll: { marginBottom: 4 },
  monthChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#222",
    marginRight: 8,
  },
  monthChipText: { color: "#555", fontSize: 13 },
  dayChip: {
    width: 42,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#222",
    alignItems: "center",
    marginRight: 8,
  },
  dayChipText: { color: "#555", fontSize: 13 },
  chipActive: { backgroundColor: "#1e1a2e", borderColor: "#a78bfa" },
  chipTextActive: { color: "#a78bfa", fontWeight: "600" },
  row: { flexDirection: "row", gap: 8 },
  reminderChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#222",
  },
  reminderChipText: { color: "#555", fontSize: 14 },
  preview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 14,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#2a2040",
  },
  previewEmoji: { fontSize: 24 },
  previewText: { fontSize: 14, color: "#a78bfa", flex: 1 },
});
