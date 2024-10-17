import { StyleSheet, View, ScrollView, Dimensions } from "react-native";
import React, { useState } from "react";
import { GlobalStyles } from "../../util/constants/styles";
import WalkReport from "../../components/walk/WalkReport";
import SpendReport from "../../components/spend/SpendReport";
import Weather from "../../components/Weather";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import Notification from "../../components/notification/NotificationManager";

const { width, height } = Dimensions.get("window");

// Home screen to display the weather, spend report, and walk reports
export default function Home() {
  const [focused, setFocused] = useState(false);
  const isFocused = useIsFocused();

  useFocusEffect(() => {
    if (!isFocused) {
      setFocused(true);
    }
  });

  return (
    <View style={styles.container}>
      <View style={{ height: height * 0.15 }}>
        <Weather />
      </View>
      {isFocused && (
        <ScrollView>
          <View style={{ height: height * 0.4 }}>
            <SpendReport />
          </View>
          <View style={[styles.walkReportContainer, { height: height * 0.4 }]}>
            <WalkReport attribute="distance" />
          </View>
          <View style={[styles.walkReportContainer, { height: height * 0.4 }]}>
            <WalkReport attribute="duration" />
          </View>
        </ScrollView>
      )}
      <Notification />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.accent,
    justifyContent: "center",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  iconWithLabel: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  iconLabel: {
    color: GlobalStyles.colors.secondary,
    fontWeight: "bold",
  },
  titleItem: {
    fontWeight: "bold",
    fontSize: GlobalStyles.fontSizes.large,
    alignSelf: "center",
    margin: 10,
  },
  walkReportContainer: {
    backgroundColor: GlobalStyles.colors.white,
    marginHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
});
