import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { onSnapshot, collection, doc } from "firebase/firestore";
import { database, auth } from "../../firebase-files/firebaseSetup";
import { GlobalStyles } from "../../util/constants/styles";
import { AntDesign } from "@expo/vector-icons";
import { deleteFromDB, updateToDB } from "../../firebase-files/firebaseHelper";
import { Alert } from "react-native";

// MyWalks screen to display user's walk records
export default function MyWalks() {
  const [myWalks, setMyWalks] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(doc(database, "users", auth.currentUser.uid), "walkRecord"),
      (snapshot) => {
        const formattedData = snapshot.docs
          .map((doc) => {
            const {
              distance,
              duration,
              positions,
              startTime,
              endTime,
              photoWalkId,
              like,
            } = doc.data();
            return {
              id: doc.id,
              distance,
              duration,
              positions,
              startTime: startTime.toDate(),
              endTime,
              photoWalkId,
              like,
            };
          })
          .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
        const formattedWalks = formattedData.map((walk) => ({
          ...walk,
          startTime: walk.startTime.toLocaleString(),
          endTime: walk.endTime.toDate().toLocaleString(),
        }));
        setMyWalks(formattedWalks);
      },
      (error) => console.log(error.message)
    );
    return () => unsubscribe();
  }, []);

  // Function to handle press on a walk record
  const pressWalkHandler = (walkId) => {
    navigation.navigate("Walk Record", {
      data: myWalks.filter((walk) => walk.id === walkId),
    });
  };

  // Function to handle delete walk record
  function deleteWalkHandler(walkId) {
    deleteFromDB("walkRecord", walkId);
  }

  // Function to handle like walk record
  function likeWalkHandler(walkId, updatedLike) {
    updateToDB("walkRecord", walkId, { like: updatedLike });
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={myWalks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => pressWalkHandler(item.id)}
            style={styles.walkItem}
          >
            <View>
              <Text style={styles.headerText}>{item.startTime}</Text>
              <Text style={styles.text}>Duration: {item.duration} mins</Text>
              <Text style={styles.text}>Distance: {item.distance} km</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => likeWalkHandler(item.id, !item.like)}
                style={styles.button}
              >
                <AntDesign
                  name={item.like ? "heart" : "hearto"}
                  size={height / 40}
                  color={item.like ? "red" : "grey"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Confirm Delete",
                    "Are you sure you want to delete this walk record?",
                    [
                      {
                        text: "No",
                        onPress: () => console.log("Deletion cancelled"),
                        style: "cancel",
                      },
                      {
                        text: "Yes",
                        onPress: () => deleteWalkHandler(item.id),
                      },
                    ],
                    { cancelable: true }
                  );
                }}
                style={styles.button}
              >
                <AntDesign name="delete" size={height / 40} color="grey" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const { width, height } = Dimensions.get("window");
//console.log("width = ", width);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  walkItem: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: GlobalStyles.colors.white,
    marginHorizontal: 10,
    marginTop: 10,
    flexDirection: "row",
  },
  headerText: {
    fontSize: width / 25,
    color: GlobalStyles.colors.dark_grey,
    fontWeight: "bold",
    marginHorizontal: 5,
    marginBottom: 10,
  },
  text: {
    fontSize: width / 30,
    color: GlobalStyles.colors.dark_grey,
    marginHorizontal: 5,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginRight: 10,
  },
});
