import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { GlobalStyles } from "../../util/constants/styles";
import { onSnapshot, collection, doc } from "firebase/firestore";
import { database, auth } from "../../firebase-files/firebaseSetup";
import { deleteFromDB } from "../../firebase-files/firebaseHelper";

// Notification component to display user's notifications
export default function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(doc(database, "users", auth.currentUser.uid), "notifications"),
      (snapshot) => {
        const formattedData = snapshot.docs
          .map((doc) => {
            const { title, body, date } = doc.data();
            return {
              id: doc.id,
              title,
              body,
              date: date.toDate(),
            };
          })
          .sort((a, b) => b.date.getTime() - a.date.getTime());
        setNotifications(formattedData);
      },
      (error) => console.log(error.message)
    );
    return () => unsubscribe();
  }, []);

  // Function to format the date
  function formatDate(date) {
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    return `${month} ${day}`;
  }

  // Function to handle the delete event
  function deleteHandler(id) {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        { text: "No" },
        { text: "Yes", onPress: () => deleteFromDB("notifications", id) },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback onLongPress={() => deleteHandler(item.id)}>
            <View style={styles.notificationContainer}>
              <View style={styles.horizontalNotification}>
                <Text style={styles.titleText}>{item.title}</Text>
                <Text style={styles.dateText}>{formatDate(item.date)}</Text>
              </View>
              {item.body && (
                <View style={styles.bodyContainer}>
                  <Text style={styles.bodyText}>{item.body}</Text>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.white,
    justifyContent: "center",
  },
  notificationContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    margin: 10,
    padding: 10,
  },
  horizontalNotification: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 14,
    color: GlobalStyles.colors.dark_grey,
  },
  bodyContainer: {
    marginTop: 10,
  },
  bodyText: {
    fontSize: 12,
    color: GlobalStyles.colors.dark_grey,
  },
});
