import { Alert } from "react-native";
import * as Notifications from "expo-notifications";
import { writeToDB } from "../../firebase-files/firebaseHelper";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef } from "react";

// Notification component to handle notifications
export default function Notification() {
  const navigation = useNavigation();
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener(async (notification) => {
        try {
          await writeToDB("notifications", {
            title: notification.request.content.title,
            body: notification.request.content.body,
            date: new Date(),
          });
        } catch (error) {
          console.error("Error writing notification to database:", error);
        }
      });
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const screenName = response.notification.request.content.data.screen;
        if (!screenName) {
          navigation.navigate("Notification");
        } else {
          navigation.navigate(screenName);
        }
      });
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  return null;
}

// Function to verify permissions for notifications
export async function verifyPermissions() {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission not granted for notifications");
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error("Error verifying permissions:", error);
    return false;
  }
}


