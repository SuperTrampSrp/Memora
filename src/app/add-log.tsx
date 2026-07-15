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
import { useLogStore } from "../store/logStore";
import { LogType } from "../types";

const LOG_TYPES: {
  label: string;
  value: LogType;
  emoji: string;
  desc: string;
}[] = [
  { label: "Visit", value: "visit", emoji: "📍", desc: "Place you went" },
  { label: "Email", value: "email", emoji: "📧", desc: "Email you sent" },
  { label: "Call", value: "call", emoji: "📞", desc: "Call you made" },
  { label: "Meeting", value: "meeting", emoji: "🤝", desc: "Meeting attended" },
  { label: "Note", value: "note", emoji: "📝", desc: "General note" },
  { label: "Other", value: "other", emoji: "📌", desc: "Anything else" },
];

export default function AddLogScreen() {
  const [type, setType] = useState<LogType>("note");
  const [title, setTitle] = useState("");
  const [person, setPerson] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const { addLog } = useLogStore();

  const isVisit = type === "visit";

  function handleSave() {
    if (!title.trim()) {
      Alert.alert("Oops", "Please enter a title.");
      return;
    }
    if (!startDate) {
      Alert.alert("Oops", "Please select a date.");
      return;
    }

    addLog({
      type,
      title: title.trim(),
      description: description.trim() || null,
      person: person.trim() || null,
      startDate: startDate.toISOString(),
      endDate: endDate ? endDate.toISOString() : null,
    });
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>New Log</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.save}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Type */}
        <Text style={styles.label}>Type</Text>
        <View style={styles.typeGrid}>
          {LOG_TYPES.map((t) => (
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
              <Text style={styles.typeDesc}>{t.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Title */}
        <Text style={styles.label}>
          {type === "visit"
            ? "Place name"
            : type === "email"
              ? "Email subject / to whom"
              : type === "call"
                ? "Who did you call"
                : type === "meeting"
                  ? "Meeting name"
                  : "Title"}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={
            type === "visit"
              ? "e.g. Goa beach trip"
              : type === "email"
                ? "e.g. Project proposal to Rahul"
                : type === "call"
                  ? "e.g. Called Mom"
                  : type === "meeting"
                    ? "e.g. Q1 review meeting"
                    : "e.g. My note"
          }
          placeholderTextColor="#444"
          value={title}
          onChangeText={setTitle}
          autoFocus
        />

        {/* Person */}
        <Text style={styles.label}>
          {type === "visit" ? "With whom" : "Person"}{" "}
          <Text style={styles.optional}>(optional)</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Family, Rahul, Client..."
          placeholderTextColor="#444"
          value={person}
          onChangeText={setPerson}
        />

        {/* Description */}
        <Text style={styles.label}>
          Notes <Text style={styles.optional}>(optional)</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Add details about this log..."
          placeholderTextColor="#444"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        {/* Start date */}
        <Text style={styles.label}>{isVisit ? "From date" : "Date"}</Text>
        <DatePicker
          value={startDate}
          onChange={setStartDate}
          placeholder="Select date"
        />

        {/* End date — only for visits */}
        {isVisit && (
          <>
            <Text style={styles.label}>
              To date <Text style={styles.optional}>(optional)</Text>
            </Text>
            <DatePicker
              value={endDate}
              onChange={setEndDate}
              placeholder="Select end date"
            />
            {!!endDate && (
              <TouchableOpacity
                onPress={() => setEndDate(null)}
                style={styles.clearBtn}
              >
                <Text style={styles.clearBtnText}>✕ Clear end date</Text>
              </TouchableOpacity>
            )}
          </>
        )}

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
  notesInput: { height: 100, textAlignVertical: "top" },
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  typeCard: {
    width: "30%",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#222",
    alignItems: "center",
    gap: 4,
  },
  typeCardActive: { borderColor: "#a78bfa", backgroundColor: "#1e1a2e" },
  typeEmoji: { fontSize: 22 },
  typeLabel: { fontSize: 12, color: "#555", fontWeight: "600" },
  typeLabelActive: { color: "#a78bfa" },
  typeDesc: { fontSize: 10, color: "#333", textAlign: "center" },
  clearBtn: { marginTop: 10, alignItems: "center" },
  clearBtnText: { fontSize: 13, color: "#555" },
});
