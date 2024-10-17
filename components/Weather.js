import { StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import * as Location from "expo-location";
import { weatherApiKey } from "@env";
import { GlobalStyles } from "../util/constants/styles";

// Export the getWeather function for use in other files
export async function getWeather() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission not granted");
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});

    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${location.coords.latitude},${location.coords.longitude}&days=1&aqi=no`;

    const response = await axios.get(apiUrl);

    return response.data; // Return weather data
  } catch (error) {
    console.log("Error getting weather", error);
    return null; // Return null in case of error
  }
}

// Weather component to display the weather
export default function Weather() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    getWeather().then((data) => {
      setWeather(data);
    });
  }, []);

  const weatherEmoji = {
    overcast: "🌥",
    cloudy: "⛅",
    sunny: "🌞",
    rain: "🌧",
    mist: "🌫",
    clear: "🌝",
    thunderstorms: "🌩",
    tornado: "🌪",
    hurricane: "🌀",
    snow: "❄️",
  };

  //   Function to get the weather emoji
  function getWeatherEmoji(condition) {
    const words = condition.toLowerCase().split(" ");
    const lastWord = words[words.length - 1];
    if (lastWord in weatherEmoji) {
      return weatherEmoji[lastWord];
    } else {
      return condition;
    }
  }

  if (!weather) {
    return <View style={styles.container}></View>;
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={styles.cityText}>{weather.location.name}</Text>
        <Text style={styles.tempText}>{weather.current.temp_c}˚</Text>
      </View>
      <View
        style={{ flex: 1, alignItems: "flex-end", justifyContent: "center" }}
      >
        <Text style={styles.weatherIcon}>
          {getWeatherEmoji(weather.current.condition.text)}
        </Text>
        <Text style={styles.conditionText}>
          {weather.current.condition.text}
        </Text>
        <Text style={styles.forecastText}>
          H: {weather.forecast.forecastday[0].day.maxtemp_c}˚ L:{" "}
          {weather.forecast.forecastday[0].day.mintemp_c}˚
        </Text>
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: width / 15,
    paddingHorizontal: width / 30,
    justifyContent: "space-between",
    backgroundColor: GlobalStyles.colors.secondary,
    margin: 10,
    borderRadius: 10,
  },
  cityText: {
    color: GlobalStyles.colors.white,
    fontWeight: "bold",
    fontSize: width / 20,
  },
  tempText: {
    color: "white",
    fontSize: width / 12,
    fontWeight: "bold",
  },
  weatherIcon: {
    fontSize: width / 18,
  },
  conditionText: {
    color: "white",
    fontSize: width / 30,
    fontWeight: "bold",
  },
  forecastText: {
    marginTop: 5,
    color: "white",
    fontSize: width / 30,
    fontWeight: "bold",
  },
});
