import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  title: string;
  count?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, count, actionLabel, onAction }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        {!!count && <Text style={styles.count}>{count}</Text>}
      </View>
      {!!actionLabel && !!onAction && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.action}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: "#888",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  count: { fontSize: 12, color: "#444" },
  action: { fontSize: 13, color: "#a78bfa" },
});
