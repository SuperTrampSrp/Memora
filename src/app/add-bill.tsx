import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DatePicker } from "../components/DatePicker";
import { useBillStore } from "../store/billStore";
import { BillFrequency } from "../types";

const FREQUENCIES: { label: string; value: BillFrequency; emoji: string }[] = [
  { label: "Weekly", value: "weekly", emoji: "📅" },
  { label: "Monthly", value: "monthly", emoji: "🗓️" },
  { label: "Yearly", value: "yearly", emoji: "📆" },
  { label: "One Time", value: "one_time", emoji: "1️⃣" },
];

const CATEGORIES = [
  { label: "Electricity", emoji: "⚡" },
  { label: "Internet", emoji: "🌐" },
  { label: "Water", emoji: "💧" },
  { label: "Rent", emoji: "🏠" },
  { label: "Insurance", emoji: "🛡️" },
  { label: "Streaming", emoji: "📺" },
  { label: "Phone", emoji: "📱" },
  { label: "Gym", emoji: "💪" },
  { label: "Other", emoji: "📦" },
];

const REMINDER_DAYS = [1, 3, 5, 7];

export default function AddBillScreen() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState<BillFrequency>("monthly");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [category, setCategory] = useState("Other");
  const [reminderDays, setReminderDays] = useState(3);
  const [autoPay, setAutoPay] = useState(false);
  const { addBill } = useBillStore();

  function handleSave() {
    if (!title.trim()) {
      Alert.alert("Oops", "Please enter a bill name.");
      return;
    }
    if (!dueDate) {
      Alert.alert("Oops", "Please select a due date.");
      return;
    }

    addBill({
      title: title.trim(),
      amount: amount ? parseFloat(amount) : null,
      frequency,
      dueDate: dueDate.toISOString(),
      reminderDaysBefore: reminderDays,
      autoPay,
      category,
    });
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Add Bill</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.save}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.label}>Bill name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Electricity Bill"
          placeholderTextColor="#444"
          value={title}
          onChangeText={setTitle}
          autoFocus
        />

        {/* Amount */}
        <Text style={styles.label}>
          Amount <Text style={styles.optional}>(optional)</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 1200"
          placeholderTextColor="#444"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        {/* Due date */}
        <Text style={styles.label}>Due date</Text>
        <DatePicker
          value={dueDate}
          onChange={setDueDate}
          placeholder="Select due date"
        />

        {/* Frequency */}
        <Text style={styles.label}>Frequency</Text>
        <View style={styles.grid2}>
          {FREQUENCIES.map((f) => (
            <TouchableOpacity
              key={f.value}
              style={[
                styles.optionCard,
                frequency === f.value && styles.optionCardActive,
              ]}
              onPress={() => setFrequency(f.value)}
            >
              <Text style={styles.optionEmoji}>{f.emoji}</Text>
              <Text
                style={[
                  styles.optionLabel,
                  frequency === f.value && styles.optionLabelActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Reminder */}
        <Text style={styles.label}>Remind me before</Text>
        <View style={styles.row}>
          {REMINDER_DAYS.map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.chip, reminderDays === d && styles.chipActive]}
              onPress={() => setReminderDays(d)}
            >
              <Text
                style={[
                  styles.chipText,
                  reminderDays === d && styles.chipTextActive,
                ]}
              >
                {d}d
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c.label}
              style={[
                styles.categoryBtn,
                category === c.label && styles.categoryBtnActive,
              ]}
              onPress={() => setCategory(c.label)}
            >
              <Text style={styles.categoryEmoji}>{c.emoji}</Text>
              <Text
                style={[
                  styles.categoryLabel,
                  category === c.label && styles.categoryLabelActive,
                ]}
              >
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Auto pay toggle */}
        <View style={styles.switchRow}>
          <View>
            <Text style={styles.switchLabel}>Auto Pay</Text>
            <Text style={styles.switchSub}>Mark as automatically paid</Text>
          </View>
          <Switch
            value={autoPay}
            onValueChange={setAutoPay}
            trackColor={{ false: "#222", true: "#7c3aed" }}
            thumbColor={autoPay ? "#a78bfa" : "#444"}
          />
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
  grid2: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#222",
    minWidth: "47%",
  },
  optionCardActive: { borderColor: "#a78bfa", backgroundColor: "#1e1a2e" },
  optionEmoji: { fontSize: 18 },
  optionLabel: { fontSize: 13, color: "#555" },
  optionLabelActive: { color: "#a78bfa", fontWeight: "600" },
  row: { flexDirection: "row", gap: 8 },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#222",
  },
  chipActive: { backgroundColor: "#1e1a2e", borderColor: "#a78bfa" },
  chipText: { color: "#555", fontSize: 14 },
  chipTextActive: { color: "#a78bfa", fontWeight: "600" },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  categoryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#222",
  },
  categoryBtnActive: { borderColor: "#a78bfa", backgroundColor: "#1e1a2e" },
  categoryEmoji: { fontSize: 16 },
  categoryLabel: { fontSize: 13, color: "#555" },
  categoryLabelActive: { color: "#a78bfa", fontWeight: "600" },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#222",
  },
  switchLabel: { fontSize: 15, color: "#ddd", fontWeight: "500" },
  switchSub: { fontSize: 12, color: "#444", marginTop: 2 },
});
