import { router } from "expo-router";
import { useEffect, useState } from "react";
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
import { AddButton } from "../../components/AddButton";
import { useLogStore } from "../../store/logStore";
import { LogEntry, LogType } from "../../types";

const TYPE_CONFIG: Record<LogType, { emoji: string; color: string }> = {
  visit: { emoji: "📍", color: "#34d399" },
  email: { emoji: "📧", color: "#60a5fa" },
  call: { emoji: "📞", color: "#a78bfa" },
  meeting: { emoji: "🤝", color: "#fb923c" },
  note: { emoji: "📝", color: "#facc15" },
  other: { emoji: "📌", color: "#888" },
};

function formatDate(isoStr: string): string {
  const date = new Date(isoStr);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function groupByMonth(logs: LogEntry[]) {
  const groups: Record<string, LogEntry[]> = {};
  logs.forEach((log) => {
    const date = new Date(log.startDate);
    const key = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    if (!groups[key]) groups[key] = [];
    groups[key].push(log);
  });
  return groups;
}

export default function LogsScreen() {
  const { logs, loadLogs, search, removeLog } = useLogStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadLogs();
  }, []);

  function handleSearch(text: string) {
    setQuery(text);
    search(text);
  }

  function handleDelete(id: string, title: string) {
    Alert.alert(`Delete "${title}"?`, "This log will be permanently removed.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => removeLog(id) },
    ]);
  }

  const grouped = groupByMonth(logs);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Logs</Text>
          <Text style={styles.subtitle}>Your personal timeline</Text>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search logs..."
            placeholderTextColor="#444"
            value={query}
            onChangeText={handleSearch}
          />
          {!!query && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Add button */}
        <View style={styles.addRow}>
          <AddButton
            label="+ New log entry"
            onPress={() => router.push("/add-log")}
          />
        </View>

        {/* Empty state */}
        {logs.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📖</Text>
            <Text style={styles.emptyText}>No logs yet</Text>
            <Text style={styles.emptySubText}>
              Record visits, emails, calls and notes{"\n"}to build your personal
              timeline
            </Text>
          </View>
        )}

        {/* Grouped by month */}
        {Object.entries(grouped).map(([month, entries]) => (
          <View key={month} style={styles.monthGroup}>
            <Text style={styles.monthLabel}>{month}</Text>
            {entries.map((log) => {
              const config = TYPE_CONFIG[log.type];
              return (
                <TouchableOpacity
                  key={log.id}
                  style={styles.logCard}
                  onLongPress={() => handleDelete(log.id, log.title)}
                  activeOpacity={0.7}
                >
                  {/* Left timeline line */}
                  <View style={styles.timeline}>
                    <View
                      style={[
                        styles.timelineDot,
                        { backgroundColor: config.color },
                      ]}
                    />
                    <View style={styles.timelineLine} />
                  </View>

                  {/* Content */}
                  <View style={styles.logContent}>
                    <View style={styles.logHeader}>
                      <Text style={styles.logEmoji}>{config.emoji}</Text>
                      <View style={styles.logTitleRow}>
                        <Text style={styles.logTitle}>{log.title}</Text>
                        <Text style={styles.logType}>{log.type}</Text>
                      </View>
                    </View>

                    {!!log.person && (
                      <Text style={styles.logPerson}>👤 {log.person}</Text>
                    )}

                    {!!log.description && (
                      <Text style={styles.logDesc} numberOfLines={2}>
                        {log.description}
                      </Text>
                    )}

                    <View style={styles.logDateRow}>
                      <Text style={styles.logDate}>
                        {formatDate(log.startDate)}
                        {!!log.endDate && ` → ${formatDate(log.endDate)}`}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f" },

  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 },
  title: { fontSize: 32, fontWeight: "700", color: "#fff", marginTop: 2 },
  subtitle: { fontSize: 13, color: "#444", marginTop: 4 },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161616",
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#222",
    gap: 8,
  },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, color: "#fff", fontSize: 15 },
  clearSearch: { color: "#555", fontSize: 14 },

  addRow: { paddingHorizontal: 20, marginTop: 12 },

  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 18, color: "#333", fontWeight: "600" },
  emptySubText: {
    fontSize: 13,
    color: "#2a2a2a",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },

  monthGroup: { paddingHorizontal: 20, marginTop: 24 },
  monthLabel: {
    fontSize: 12,
    color: "#555",
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 12,
  },

  logCard: {
    flexDirection: "row",
    marginBottom: 4,
  },

  timeline: { alignItems: "center", width: 20, marginRight: 12 },
  timelineDot: { width: 10, height: 10, borderRadius: 5, marginTop: 6 },
  timelineLine: { flex: 1, width: 1, backgroundColor: "#1e1e1e", marginTop: 4 },

  logContent: {
    flex: 1,
    backgroundColor: "#161616",
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#1e1e1e",
  },
  logHeader: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  logEmoji: { fontSize: 18 },
  logTitleRow: { flex: 1 },
  logTitle: { fontSize: 15, color: "#ddd", fontWeight: "500" },
  logType: {
    fontSize: 10,
    color: "#444",
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  logPerson: { fontSize: 12, color: "#555", marginTop: 6 },
  logDesc: { fontSize: 13, color: "#444", marginTop: 6, lineHeight: 18 },
  logDateRow: { marginTop: 8 },
  logDate: { fontSize: 11, color: "#333" },
});
