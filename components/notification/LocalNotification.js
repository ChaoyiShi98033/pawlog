import * as Notifications from "expo-notifications";
import { verifyPermissions } from "./NotificationManager";

// Function to set a local notification
export async function setLocalNotification(date) {
  console.log("date:", date);
  try {
     const hasPermission = await verifyPermissions();
     if (!hasPermission) {
       return;
     }
     const id = await Notifications.scheduleNotificationAsync({
       content: {
        title: "🐕 Walkies Call!",
        body: "Who’s ready for walkies? Your dog sure is! Let’s go make some tracks. 🐾",
         data: { screen: "Walk" },
       },
       trigger: {
         date: date,
         repeats: false,
       },
     });
     console.log("Notification set:", id);

     return id;
   } catch (error) {
     console.error("Error setting local notification:", error);
   }
  }

// Function to cancel a local notification
export async function cancelLocalNotification(id) {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
    console.log("Notification cancelled:", id);
  } catch (error) {
    console.error("Error cancelling notification:", error);
  }
}