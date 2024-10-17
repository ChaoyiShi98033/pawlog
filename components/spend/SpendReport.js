import { StyleSheet, Text, View, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import { PieChartComponent } from "../../util/charts";
import { GlobalStyles } from "../../util/constants/styles";
import { database, auth } from "../../firebase-files/firebaseSetup";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { getSunday } from "../../util/helper";

//SpendReport filters the data from the most recent week and groups them by category (displays on home screen).
export default function SpendReport() {
  const [data, setData] = useState([]);
  const [weekRange, setWeekRange] = useState('');

  useEffect(() => {
    const startDate = getSunday();
    const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000); // Adding 6 days to start date
    setWeekRange(`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);

    const q = query(
      collection(database, "users", auth.currentUser.uid, "spendRecord"),
      where("date", ">=", startDate)
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const records = querySnapshot.docs.map((doc) => doc.data());
        const formattedData = records.map((item) => {
          return {
            category: item.category,
            amount: item.price,
          };
        });

        const groupedData = groupData(formattedData);
        setData(groupedData);
      },
      (error) => {
        console.log("Error fetching spend records:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Group the data by category
  function groupData(data) {
    const groupedData = {};

    data.forEach((item) => {
      if (!groupedData[item.category]) {
        groupedData[item.category] = 0; // Initialize amount to 0 for each category
      }
      groupedData[item.category] += item.amount; // Accumulate the amount for each category
    });

    return groupedData;
  }
  // console.log("spend report:",data)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Spending</Text>
      <Text style={styles.weekRange}>{weekRange}</Text>
      <PieChartComponent data={data} />
    </View>
  );
}

const width = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.white,
    //justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: width / 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
    color: GlobalStyles.colors.dark_grey,
  },
  weekRange: {
    fontSize: width / 30,
    textAlign: "center",
    marginBottom: 20,
    color: GlobalStyles.colors.dark_grey,
  },
});
