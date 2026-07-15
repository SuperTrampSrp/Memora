import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
}: Props) {
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(value ?? new Date());

  function formatDate(date: Date): string {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }

  function handleIOSConfirm() {
    onChange(tempDate);
    setShow(false);
  }

  function handleIOSCancel() {
    setTempDate(value ?? new Date());
    setShow(false);
  }

  return (
    <View>
      <TouchableOpacity style={styles.trigger} onPress={() => setShow(true)}>
        <Text style={styles.calendarIcon}>📅</Text>
        <Text style={[styles.triggerText, !value && styles.placeholder]}>
          {value ? formatDate(value) : placeholder}
        </Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      {/* Android */}
      {Platform.OS === "android" && show && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          onValueChange={(event, date) => {
            setShow(false);
            if (date) onChange(date);
          }}
          onDismiss={() => setShow(false)}
          minimumDate={new Date(2000, 0, 1)}
        />
      )}

      {/* iOS */}
      {Platform.OS === "ios" && (
        <Modal visible={show} transparent animationType="slide">
          <TouchableOpacity
            style={styles.overlay}
            onPress={handleIOSCancel}
            activeOpacity={1}
          />
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={handleIOSCancel}>
                <Text style={styles.sheetCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Select Date</Text>
              <TouchableOpacity onPress={handleIOSConfirm}>
                <Text style={styles.sheetConfirm}>Done</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              onValueChange={(event, date) => {
                if (date) setTempDate(date);
              }}
              onDismiss={handleIOSCancel}
              minimumDate={new Date(2000, 0, 1)}
              themeVariant="dark"
              style={styles.iosPicker}
            />
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#222",
    gap: 10,
  },
  calendarIcon: { fontSize: 16 },
  triggerText: { flex: 1, fontSize: 15, color: "#fff" },
  placeholder: { color: "#444" },
  arrow: { fontSize: 18, color: "#444" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  sheet: {
    backgroundColor: "#161616",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
    borderWidth: 1,
    borderColor: "#222",
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  sheetTitle: { fontSize: 15, fontWeight: "600", color: "#fff" },
  sheetCancel: { fontSize: 15, color: "#666" },
  sheetConfirm: { fontSize: 15, color: "#a78bfa", fontWeight: "600" },
  iosPicker: { marginHorizontal: 10 },
});
