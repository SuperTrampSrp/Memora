import * as Haptics from "expo-haptics";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface FABOption {
  label: string;
  emoji: string;
  onPress: () => void;
}

interface Props {
  options: FABOption[];
}

export function FloatingActionButton({ options }: Props) {
  const [open, setOpen] = useState(false);

  function handleOpen() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setOpen(true);
  }

  function handleSelect(option: FABOption) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOpen(false);
    setTimeout(() => option.onPress(), 150);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <>
      {/* Backdrop + options sheet */}
      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.backdrop} onPress={handleClose}>
          <View style={styles.sheet}>
            {/* Sheet title */}
            <Text style={styles.sheetTitle}>What do you want to add?</Text>

            {/* Options grid */}
            <View style={styles.optionsGrid}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.label}
                  style={styles.optionCard}
                  onPress={() => handleSelect(option)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionEmoji}>{option.emoji}</Text>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Cancel */}
            <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* FAB button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleOpen}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>{open ? "✕" : "+"}</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#161616",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: "#222",
  },
  sheetTitle: {
    fontSize: 13,
    color: "#555",
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 20,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  optionCard: {
    width: "30%",
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  optionEmoji: { fontSize: 28 },
  optionLabel: {
    fontSize: 12,
    color: "#aaa",
    fontWeight: "500",
    textAlign: "center",
  },
  cancelBtn: {
    marginTop: 16,
    padding: 14,
    backgroundColor: "#1a1a1a",
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#222",
  },
  cancelText: { fontSize: 15, color: "#555" },

  fab: {
    position: "absolute",
    bottom: 28,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#a78bfa",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#a78bfa",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "300",
    lineHeight: 32,
  },
});
