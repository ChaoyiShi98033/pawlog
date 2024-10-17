import { StyleSheet, Text, View } from "react-native";

// Monitor component to display the duration and distance of a walk
export default function Monitor({ duration, distance }) {
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Duration: {duration} mins</Text>
      <Text style={styles.text}>Distance: {distance} km</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    marginLeft: 90,
  },
});
