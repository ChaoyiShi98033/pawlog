import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { savePhoto } from "../../firebase-files/photoService";
import { useNavigation } from "@react-navigation/native";
import useAddress from "../../util/useAddress";
import { ButtonStyles } from "../../util/constants/buttonStyles";
import PressableButton from "../../util/UI/PressableButton";

export default function PhotoForm({ route }) {
  const navigation = useNavigation();
  const { imageUri, location, photoWalkId } = route.params;
  const address = useAddress(location?.latitude, location?.longitude);

  // Function to save the photo to the database
  const handleSave = async () => {
    try {
      await savePhoto(imageUri, location, photoWalkId);
      navigation.navigate("Walk");
    } catch (error) {
      console.error("Error saving photo: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imagePreview}>
        {imageUri && <Image style={styles.image} source={{ uri: imageUri }} />}
      </View>
      <Text>{address || "Resolving address..."}</Text>
      <View style={styles.buttonBox}>
        <PressableButton
          customStyle={ButtonStyles.saveButton}
          onPressFunction={handleSave}
          children={"Save Photo"}
        />
        {/*       <TouchableOpacity onPress={handleSave} style={styles.button}>
        <Text style={styles.buttonText}>Save Photo</Text>
      </TouchableOpacity> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePreview: {
    width: "100%",
    height: 400,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  buttonBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "space-around",
  },
});
