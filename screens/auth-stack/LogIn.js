import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { GlobalStyles } from "../../util/constants/styles";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { auth } from "../../firebase-files/firebaseSetup";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  // Function to handle user login
  async function logInHandler() {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace("Back");
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        alert("Wrong password");
      } else if (error.code === "auth/user-not-found") {
        alert("User not found");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email");
      } else {
        alert("Something went wrong. Please try again");
        console.log("log in error:", error);
      }
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.imageStyle}
        />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>WELCOME BACK</Text>
        <View style={styles.loginContainer}>
          <Text
            style={[styles.plainText, { color: GlobalStyles.colors.dark_grey }]}
          >
            First time here?{" "}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.replace("SignUp")}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="email"
          style={styles.userInfoBox}
          onChangeText={(text) => setEmail(text)}
          value={email}
          keyboardType="default"
        />
        <TextInput
          placeholder="password"
          style={styles.userInfoBox}
          onChangeText={(text) => setPassword(text)}
          value={password}
          keyboardType="default"
          secureTextEntry={true}
        />
        {/* User's info will go here */}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.signUpButton} onPress={logInHandler}>
          <Text style={styles.signUpText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: GlobalStyles.colors.primary,
    paddingTop: height / 30,
  },
  imageContainer: {
    alignItems: "center",
  },
  titleContainer: {},
  inputContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 30,
    marginLeft: 15,
    marginRight: 10,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 10,
  },

  imageStyle: {
    width: 200,
    height: 200,
    borderRadius: 100, // Make the image circular
  },

  titleText: {
    fontSize: width / 12,
    color: GlobalStyles.colors.black,
    margin: 10,
    textAlign: "center",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  userInfoBox: {
    height: 40,
    borderRadius: 20,
    fontSize: GlobalStyles.fontSizes.large,
    width: "85%",
    justifyContent: "center",
    marginBottom: 10,
    color: GlobalStyles.colors.secondary,
    backgroundColor: GlobalStyles.colors.light_grey,
    paddingLeft: 20,
  },
  buttonBox: {
    flex: 1,
    flexDirection: "column",
    marginTop: 30,
    alignItems: "center",
  },

  loginButton: {
    borderRadius: 5,
  },
  loginButtonText: {
    color: GlobalStyles.colors.secondary,
    fontSize: 12,
  },
  plainText: {
    fontSize: 12,
    textAlign: "center",
    marginHorizontal: 5,
  },
  signUpButton: {
    backgroundColor: GlobalStyles.colors.secondary,
    borderRadius: 20,
    padding: 10,
    width: "85%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  signUpText: {
    color: GlobalStyles.colors.white,
    fontSize: 15,
    fontWeight: "bold",
  },
});
