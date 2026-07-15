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
import { useShoppingStore } from "../store/shoppingStore";
import { ShoppingCategory, ShoppingPriority } from "../types";

const CATEGORIES: { label: string; value: ShoppingCategory; emoji: string }[] =
  [
    { label: "Grocery", value: "grocery", emoji: "🛒" },
    { label: "Vegetable", value: "vegetable", emoji: "🥦" },
    { label: "Fruit", value: "fruit", emoji: "🍎" },
    { label: "Dairy", value: "dairy", emoji: "🥛" },
    { label: "Meat", value: "meat", emoji: "🥩" },
    { label: "Medicine", value: "medicine", emoji: "💊" },
    { label: "Electronics", value: "electronics", emoji: "🔌" },
    { label: "Household", value: "household", emoji: "🏠" },
    { label: "Clothing", value: "clothing", emoji: "👕" },
    { label: "Other", value: "other", emoji: "📦" },
  ];

const PRIORITIES: {
  label: string;
  value: ShoppingPriority;
  color: string;
  desc: string;
}[] = [
  { label: "Urgent", value: "urgent", color: "#f87171", desc: "Need it now" },
  {
    label: "Necessary",
    value: "necessary",
    color: "#a78bfa",
    desc: "Need it soon",
  },
  { label: "Can Skip", value: "can_skip", color: "#555", desc: "Nice to have" },
];

export default function AddShoppingScreen() {
  const [title, setTitle] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState<ShoppingCategory>("grocery");
  const [priority, setPriority] = useState<ShoppingPriority>("necessary");
  const { addItem } = useShoppingStore();

  function handleSave() {
    if (!title.trim()) {
      Alert.alert("Oops", "Please enter an item name.");
      return;
    }
    addItem({
      title: title.trim(),
      category,
      priority,
      quantity: quantity.trim() || null,
    });
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Add Item</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.save}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Item name */}
        <Text style={styles.label}>Item name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Tomatoes"
          placeholderTextColor="#444"
          value={title}
          onChangeText={setTitle}
          autoFocus
        />

        {/* Quantity */}
        <Text style={styles.label}>
          Quantity <Text style={styles.optional}>(optional)</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 2kg, 1 dozen, 3 packs"
          placeholderTextColor="#444"
          value={quantity}
          onChangeText={setQuantity}
        />

        {/* Priority */}
        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityRow}>
          {PRIORITIES.map((p) => (
            <TouchableOpacity
              key={p.value}
              style={[
                styles.priorityCard,
                priority === p.value && {
                  borderColor: p.color,
                  backgroundColor: `${p.color}15`,
                },
              ]}
              onPress={() => setPriority(p.value)}
            >
              <Text
                style={[
                  styles.priorityLabel,
                  priority === p.value && { color: p.color },
                ]}
              >
                {p.label}
              </Text>
              <Text style={styles.priorityDesc}>{p.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c.value}
              style={[
                styles.categoryBtn,
                category === c.value && styles.categoryBtnActive,
              ]}
              onPress={() => setCategory(c.value)}
            >
              <Text style={styles.categoryEmoji}>{c.emoji}</Text>
              <Text
                style={[
                  styles.categoryLabel,
                  category === c.value && styles.categoryLabelActive,
                ]}
              >
                {c.label}
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
  priorityRow: { flexDirection: "row", gap: 8 },
  priorityCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#222",
    alignItems: "center",
    gap: 4,
  },
  priorityLabel: { fontSize: 13, fontWeight: "600", color: "#555" },
  priorityDesc: { fontSize: 10, color: "#333", textAlign: "center" },
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
});
