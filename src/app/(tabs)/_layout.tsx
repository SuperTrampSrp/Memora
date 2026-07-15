import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

function TabIcon({
  emoji,
  label,
  focused,
}: {
  emoji: string;
  label: string;
  focused: boolean;
}) {
  return (
    <View style={styles.iconWrapper}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="☀️" label="Today" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="lists"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📋" label="Lists" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="logs"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📖" label="Logs" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#0f0f0f",
    borderTopColor: "#1a1a1a",
    borderTopWidth: 1,
    height: 72,
    paddingBottom: 8,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 6,
    gap: 2,
  },
  emoji: {
    fontSize: 22,
  },
  label: {
    fontSize: 10,
    color: "#444",
    marginTop: 2,
  },
  labelActive: {
    color: "#a78bfa",
    fontWeight: "600",
  },
});
