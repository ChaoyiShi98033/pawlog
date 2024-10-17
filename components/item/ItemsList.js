import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { GlobalStyles } from "../../util/constants/styles";
import SpendLabel from "../../util/Reuseable/SpendLabel";
import PressableButton from "../../util/UI/PressableButton";
import { useNavigation } from "@react-navigation/native";
import { onSnapshot, collection, doc } from "firebase/firestore";
import { database, auth } from "../../firebase-files/firebaseSetup";

//Component for list all spending history
export default function ItemList() {
  const navigation = useNavigation();
  const [spendRecord, setSpendRecord] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(doc(database, "users", auth.currentUser.uid), "spendRecord"),
      (snapshot) => {
        const formattedData = snapshot.docs
          .map((doc) => {
            const { category, date, price } = doc.data();
            return {
              id: doc.id,
              category,
              date: date.toDate(),
              price,
            };
          })
          .sort((a, b) => b.date.getTime() - a.date.getTime());
        const formattedSpends = formattedData.map((spend) => ({
          ...spend,
          date: spend.date.toDateString(),
        }));
        setSpendRecord(formattedSpends);
      },
      (error) => console.log(error.message)
    );
    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <PressableButton
        listBtn
        onPressFunction={() => {
          navigation.navigate("EditItem", item);
        }}
        customStyle={styles.container}
      >
        <View style={styles.activityContainer}>
          <Text style={styles.activityText}>{item.category}</Text>
        </View>

        <View style={styles.activitiesRightContainer}>
          <View style={styles.dateAndTimeContainer}>
            <SpendLabel
              content={item.date}
              selfStyle={styles.dateAndTimeText}
            />
          </View>

          <View style={styles.dateAndTimeContainer}>
            <SpendLabel
              content={`$${item.price}`}
              selfStyle={styles.dateAndTimeText}
            />
          </View>
        </View>
      </PressableButton>
    );
  };

  return (
    <FlatList
      data={spendRecord}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: GlobalStyles.paddings.small,
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.primary,
    flexDirection: "row",
    borderRadius: 10,
    marginBottom: 5,
    // marginLeft: 10,
    // marginRight: 10,
    marginTop: 30,
  },
  activitiesRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
  },
  activityContainer: {
    // flex: 1,
    borderRadius: 5,
  },
  dateAndTimeContainer: {
    backgroundColor: "white",
    padding: GlobalStyles.paddings.extraSmall,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginLeft: 5,
  },
  activityText: {
    color: GlobalStyles.colors.secondary,
    fontSize: GlobalStyles.fontSizes.extraLarge,
    padding: GlobalStyles.paddings.small,
    margin: 5,
    fontWeight: "bold",
  },
  icon: {
    padding: GlobalStyles.paddings.smallest,
    marginRight: 2,
  },
  dateAndTimeText: {
    fontWeight: "bold",
    fontSize: GlobalStyles.fontSizes.normal,
    color: GlobalStyles.colors.secondary,
    marginRight: 5,
  },
});
