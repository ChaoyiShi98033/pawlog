import * as Device from "expo-device";
import { getPushTokenFromDB } from "../../firebase-files/firebaseHelper";
import { verifyPermissions } from "./NotificationManager";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

// Get push token of the device
export async function getPushToken() {
  try {
    if (!Device.isDevice) {
      console.log("Push notifications are not available on simulators");
      return;
    }

    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  } catch (error) {
    console.error("Error registering for push notification:", error);
  }
}

// Send push notifications to the device
export async function sendPushNotifications(userId, content) {
  try {
    const pushToken = await getPushTokenFromDB(userId);

    const result = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: pushToken,
        title: content.title,
        body: content.body,
      }),
    });

    if (result.ok) {
      console.log("Push notification sent successfully");
    } else {
      console.log("Failed to send push notification");
    }
  } catch (error) {
    console.error("Error setting up push notifications:", error);
  }
}