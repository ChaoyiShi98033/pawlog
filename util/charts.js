import { StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;
const chartConfig = { color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`};
const colors = ["#f08080", "#ffd700", "#20b2aa", "#87ceeb", "#9370db"];

// Pie chart component
export function PieChartComponent(data) {
  if (data.data) {
    const convertedData = Object.entries(data.data).map(
      ([name, cost], index) => ({
        name: name,
        amount: cost,
        color: colors[index % colors.length],
      })
    );

    return (
      <View>
        <PieChart
          yAxisLabel="$"
          yAxisSuffix="k"
          data={convertedData}
          width={screenWidth}
          height={200}
          chartConfig={chartConfig}
          accessor={"amount"}
          backgroundColor={"transparent"}
          center={[10, 0]}
          absolute
        />
      </View>
    );
  } else {
    return <Text>No data</Text>;
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 30,
  },
});
