import * as Notifications from "expo-notifications";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initDatabase } from "../database";
import {
  requestNotificationPermissions,
  scheduleDailySummary,
} from "../utils/notifications";

export default function RootLayout() {
  useEffect(() => {
    // Init DB
    initDatabase();

    // Request permissions + schedule daily summary
    async function setup() {
      const granted = await requestNotificationPermissions();
      if (granted) {
        await scheduleDailySummary();
      }
    }
    setup();

    // Handle notification tap → navigate to correct tab
    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data as any;
        if (data?.type === "habit" || data?.type === "summary") {
          router.push("/(tabs)");
        } else if (
          data?.type === "bill" ||
          data?.type === "task" ||
          data?.type === "social"
        ) {
          router.push("/(tabs)/lists");
        }
      },
    );

    return () => sub.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
