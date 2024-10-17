import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { GlobalStyles } from "../../util/constants/styles";
import { auth } from "../../firebase-files/firebaseSetup";
import { updateProfile } from "firebase/auth";
import PressableButton from "../../util/UI/PressableButton";
import { ButtonStyles } from "../../util/constants/buttonStyles";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { deleteUserFromDB, updateProfileImage, writeProfilePhotoToDB } from "../../firebase-files/firebaseHelper";
import CredentialInput from "../../components/profile/CredentialInput";
import { deleteUser } from "firebase/auth";
import { cancelAllScheduledNotificationsAsync } from "expo-notifications";
import {FontAwesome} from '@expo/vector-icons';

// MyProfile screen to display user's profile information
export default function MyProfile() {
  const displayName = auth.currentUser.displayName;
  const email = auth.currentUser.email;
  const [image, setImage] = useState(auth.currentUser.photoURL);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Set isAuthenticated to false when the component is mounted
    setIsAuthenticated(false);
    console.log("isAuthenticated set to false");
  }, []);

  // Function to handle the press event of the image
  function pressImageHandler() {
    uploadImage();
  }

  // Function to upload an image
  const uploadImage = async () => {
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error.message);
      alert("Failed to upload image");
    }
  };

  // Function to handle the delete event
  async function deleteHandler() {
    if (!isAuthenticated) {
      setModalVisible(true);
      return;
    } else {
      Alert.alert(
        "Important",
        "Are you sure you want to delete your account? This action cannot be undone.",
        [
          {
            text: "No",
            onPress: () => console.log("Deletion canceled by user."),
            style: "cancel"
          },
          {
            text: "Yes",
            onPress: async () => {
              try {
                // Cancel all scheduled notifications
                await cancelAllScheduledNotificationsAsync();
                console.log('Notifications cancelled');
    
                // Delete user from database
                await deleteUserFromDB();
                console.log('User data deleted from database');
    
                // Delete user from Firebase Auth
                deleteUser(auth.currentUser);
                console.log('User deleted from Auth');
    
                // Optionally, sign out the user
                // signOut(auth);
                // console.log("User signed out");
              } catch (error) {
                console.log(error.message);
              }
            },
            style: "destructive"
          }
        ],
        { cancelable: true } // This allows users to tap outside the alert and cancel it
      );
    }
  }

  // Function to update the user's profile
  async function updateHandler() {
    navigation.goBack();
    if (image !== auth.currentUser.photoURL) {
      try {
        const photoURL = await writeProfilePhotoToDB(image);
        console.log("Photo URL:", photoURL);
        await updateProfileImage(photoURL);
        await updateProfile(auth.currentUser, { photoURL: photoURL });
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  return (
    <View style={styles.container}>
      <CredentialInput
        visible={modalVisible}
        dismissModal={() => setModalVisible(false)}
        reauthenticateUser={() => setIsAuthenticated(true)}
      />
      <TouchableOpacity
        onPress={pressImageHandler}
        style={styles.imageContainer}
      >
        <Image
          source={image ? { uri: image } : require("../../assets/logo.png")}
          style={styles.image}
        />
        <View style={styles.cameraLogo}>
          <FontAwesome
            name="camera"
            color={GlobalStyles.colors.secondary}
            size={25}
          />
        </View>
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <View style={styles.infoSection}>
          <Text style={styles.secondary_title}>User Name: </Text>
          <Text style={styles.content}>{displayName}</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.secondary_title}>Email: </Text>
          <Text style={styles.content}>{email}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
      <PressableButton
          customStyle={ButtonStyles.saveButton}
          onPressFunction={updateHandler}
          children={"Update"}
        />
        <PressableButton
          customStyle={ButtonStyles.cancelButton}
          onPressFunction={deleteHandler}
          children={"Delete"}
        />
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: height * 0.05,
  },
  image: {
    borderRadius: height * .1, // Make the image circular
    width: height * .2,
    height: height * .2,
  },
  infoContainer: {
    flex: 0.3,
    marginVertical: 10,
    marginHorizontal: 30,
    alignItems: 'center',
  },
  infoSection: {
    flexDirection: 'row',
    marginVertical: 10,
    marginHorizontal: 50,
    alignItems: 'center',
  },
  secondary_title: {
    fontSize: 16,
    marginVertical: 10,
    color: GlobalStyles.colors.dark_grey,
    fontWeight: "bold",
  },
  content: {
    padding: 10,
    fontSize: 14,
    color: GlobalStyles.colors.dark_grey,
  },
  buttonContainer: {
    flex: 0.3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: 80,
  },
  button: {
    backgroundColor: GlobalStyles.colors.secondary,
    padding: 10,
    width: 120,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  cameraLogo: {
    position: 'absolute', // Position absolutely to place it over the image
    bottom: height * .04, // Place it 20% from the bottom
    right: width * .01, // Place it 20% from the right
  }
});
