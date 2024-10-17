import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  Alert,
  Dimensions,
  Modal
} from "react-native";
import { deletePhoto } from "../../firebase-files/photoService";

//Component for showing the information about a photo, allows user to delete a photo. 
const Photo = ({ photo, onDeleted }) => {
  // const address = useAddress(photo.location.latitude, photo.location.longitude);
  const width = Dimensions.get("window").width;
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete the photo?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { 
          text: "Yes", 
          onPress: () => {
            (async () => {
              try {
                await deletePhoto(photo.id); // Call deletePhoto with the photo's ID
                Alert.alert("Deleted", "The photo has been deleted successfully.", [
                  { text: "OK", onPress: () => onDeleted(photo.id) },
                ]);
              } catch (error) {
                Alert.alert("Error", "Failed to delete the photo.");
              }
            })();
          } 
        }
      ],
      { cancelable: false }
    );
  };
  

  function fullImageHandler() {
    setIsFullScreen(true);
  }

  return (
    <View>
    <TouchableHighlight 
      onPress={fullImageHandler}
      onLongPress={handleDelete}
    >
      <Image 
        source={{ uri: photo.imageUrl }} 
        style={{width:width/3, height:width/3}} 
        />
    </TouchableHighlight>
    <Modal visible={isFullScreen} animationType="fade">
      <TouchableHighlight 
        onPress={() => setIsFullScreen(false)} 
        style={styles.modalContainer}
      >
        <Image 
          source={{ uri: photo.imageUrl }} 
          style={styles.fullScreenImage} 
          resizeMode="contain"   
        />
      </TouchableHighlight>
      {/* <View style={styles.address}>
        <Text style={{color:"white"}}>📍{address}</Text>
      </View> */}
    </Modal>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  photoContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
  },
  button: {
    marginTop: 10,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: width,
    height: height,
  },
  address: {
    position: 'absolute',
    top: height * .9,
    left: 40,
    //backgroundColor: 'white',
    padding: 10,
  },
});

export default Photo;
