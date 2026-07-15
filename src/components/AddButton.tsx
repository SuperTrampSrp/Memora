import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
  label: string;
  onPress: () => void;
}

export function AddButton({ label, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderWidth: 1,
    borderColor: "#222",
    borderStyle: "dashed",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    marginTop: 4,
  },
  text: { fontSize: 14, color: "#555" },
});
