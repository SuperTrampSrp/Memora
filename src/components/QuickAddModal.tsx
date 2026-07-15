import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  placeholder: string;
  onAdd: (value: string) => void;
  onClose: () => void;
}

export function QuickAddModal({ visible, placeholder, onAdd, onClose }: Props) {
  const [value, setValue] = useState("");

  function handleAdd() {
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue("");
    onClose();
  }

  function handleClose() {
    setValue("");
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity
        style={styles.overlay}
        onPress={handleClose}
        activeOpacity={1}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.sheet}
      >
        <View style={styles.handle} />
        <Text style={styles.heading}>Quick Add</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#444"
          value={value}
          onChangeText={setValue}
          autoFocus
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <View style={styles.row}>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addBtn, !value.trim() && styles.addBtnDisabled]}
            onPress={handleAdd}
            disabled={!value.trim()}
          >
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  sheet: {
    backgroundColor: "#161616",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#222",
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  heading: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#fff",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    marginBottom: 16,
  },
  row: { flexDirection: "row", gap: 10 },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#1e1e1e",
    alignItems: "center",
  },
  cancelText: { color: "#555", fontSize: 15 },
  addBtn: {
    flex: 2,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#a78bfa",
    alignItems: "center",
  },
  addBtnDisabled: { backgroundColor: "#2a2040", opacity: 0.5 },
  addText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
