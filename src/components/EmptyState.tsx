import { StyleSheet, Text, View } from "react-native";

interface Props {
  text: string;
  subText?: string;
}

export function EmptyState({ text, subText }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
      {subText && <Text style={styles.subText}>{subText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingVertical: 24 },
  text: { fontSize: 14, color: "#333", fontWeight: "500" },
  subText: {
    fontSize: 12,
    color: "#2a2a2a",
    marginTop: 4,
    textAlign: "center",
  },
});
