import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { GlobalStyles } from "../../util/constants/styles";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";

//Start screen welcomes the user, allowing them to choose to login or sign up. 
export default function Start() {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    Mallkis: require("../../assets/fonts/Mallkis.ttf"), // Load the font file
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/logo.png")} style={styles.image} />
      <Text style={styles.text}>PAWLOG</Text>
      <TouchableOpacity
        onPress={() => navigation.replace("SignUp")}
        style={[styles.button, styles.signUpButton]}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.replace("LogIn")}
        style={[styles.button, styles.logInButton]}
      >
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "Mallkis",
    fontSize: 50,
    color: GlobalStyles.colors.black,
    margin: 30,
  },
  button: {
    padding: 10,
    borderRadius: 40,
    width: 280,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  signUpButton: {
    backgroundColor: GlobalStyles.colors.secondary,
  },
  logInButton: {
    backgroundColor: GlobalStyles.colors.accent,
  },
  buttonText: {
    color: GlobalStyles.colors.white,
    fontSize: 13,
    fontWeight: "bold",
  },
});
