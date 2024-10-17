import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { auth } from "../../firebase-files/firebaseSetup";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

// CredentialInput component to reauthenticate user
export default function CredentialInput({ visible, dismissModal, reauthenticateUser }) {
  const email = auth.currentUser.email;
  const [password, setPassword] = useState("");

  // Function to reauthenticate user
  async function submitHandler() {
    try {
      const credential = EmailAuthProvider.credential(email, password);
      await reauthenticateWithCredential(auth.currentUser, credential);
      console.log("User reauthenticated");
      reauthenticateUser();
      dismissModal();
      Alert.alert("User reauthenticated","You can now delete your account.");
    } catch (err) {
      if (err.code === "auth/wrong-password") {
        alert("Wrong password");
      } else if (err.code === "auth/missing-password") {
        alert("Please enter your password");
      } else {
        alert("Error");
        console.log("submitHandler error:", err.code);
      }
    }
  }
  
  return (
    <Modal visible={visible} transparent animationType="slide">
      <ScrollView>
        <View style={styles.modalContainer}>
          <Text style={{lineHeight:20}}>Enter your password to reauthenticate your account:</Text>
          <TextInput
            style={styles.inputContainer}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={submitHandler}>
              <Text>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={dismissModal}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    paddingVertical: 30,
    paddingHorizontal: 10,
    height: height * 0.3,
    marginTop: height * 0.2,
  },
  inputContainer: {
    width: "80%",
    borderBottomWidth: 1,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});
