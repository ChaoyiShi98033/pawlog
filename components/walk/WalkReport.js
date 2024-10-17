import { StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { GlobalStyles } from "../../util/constants/styles";
import { database, auth } from "../../firebase-files/firebaseSetup";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { BarChart } from "react-native-gifted-charts";
import { getSunday, capitalizeFirstLetter } from "../../util/helper";

// WalkReport component to display weekly walk report
export default function WalkReport({ attribute }) {
  const [data, setData] = useState([]);
  const weekdays = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];
  const unit = attribute === "distance" ? "km" : "min";
  const [weekRange, setWeekRange] = useState('');

  useEffect(() => {
    const startDate = getSunday();
    const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000); // Adding 6 days to start date
    setWeekRange(`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);

    const q = query(
      collection(database, "users", auth.currentUser.uid, "walkRecord"),
      where("startTime", ">=", startDate)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const records = querySnapshot.docs.map((doc) => doc.data());

      const ungroupedData = records.map((item) => {
        return {
          label: weekdays[item.startTime.toDate().getDay()],
          value: item[attribute],
        };
      });
      const groupedData = groupData(ungroupedData);
      setData(groupedData);
    });
    return () => unsubscribe();
  }, []);

  // Function to initialize the weekdays array
  function initializeWeekdaysArray() {
    return weekdays.map((day) => ({
      label: day,
      value: 0,
    }));
  }

  // Function to group data by startDate
  function groupData(inputData) {
    // Initialize an object to store cumulative distances by startDate
    const data = {};

    // Iterate over each item in the input data
    inputData.forEach((item) => {
      if (!data[item.label]) {
        data[item.label] = 0; // Initialize cumulative distance to zero for new startDate
      }
      data[item.label] += item.value; // Add distance to cumulative total for the startDate
    });

    const weeklyData = initializeWeekdaysArray();
    weeklyData.forEach((day, index) => {
      if (data[day.label]) {
        day.value = data[day.label];
      }
    });

    return weeklyData;
  }

  // Function to get the maximum value for the y-axis
  function getMaxValue(data) {
    const result = Math.max(...data.map((item) => item.value));
    return result < 5 ? 5 : Math.ceil(result / 10) * 10;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Weekly {capitalizeFirstLetter(attribute)} ({unit})
      </Text>
      <Text style={styles.weekRange}>{weekRange}</Text>
      <BarChart
        maxValue={getMaxValue(data)}
        yAxisLabelWidth={40}
        yAxisTextStyle={{ fontSize: 10 }}
        barWidth={width * 0.05}
        spacing={width * 0.05}
        noOfSections={4}
        barBorderRadius={4}
        frontColor={GlobalStyles.colors.accent}
        data={data}
        yAxisThickness={0}
        xAxisThickness={0}
        focusBarOnPress={true}
        focusedBarConfig={{
          color: GlobalStyles.colors.secondary,
          thickness: 2,
        }}
        disableScroll={true}
        renderTooltip={(item) => {
          return <Text>{item.value}</Text>;
        }}
        yAxisExtraHeight={20}
        height={height * 0.2}
        width={width * 0.7}
        isAnimated
      />
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: width / 20,
    fontWeight: "bold",
    textAlign: "center",
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
