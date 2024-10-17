import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import Monitor from "../../components/walk/Monitor";
import { writeToDB } from "../../firebase-files/firebaseHelper";
import * as turf from "@turf/turf";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { GlobalStyles } from "../../util/constants/styles";
import { FontAwesome5 } from "@expo/vector-icons";
import { savePhoto } from "../../firebase-files/photoService";

//Walk screen allows the user to record walk route on a map, walk duration and time. 
//The user can also take photos while walk the dog, the photo will be pined on the route map. 
export default function Walk() {
  const navigation = useNavigation();
  const route = useRoute();
  const [positions, setPositions] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(null);
  const [distance, setDistance] = useState(null);
  const [showMonitor, setShowMonitor] = useState(false);
  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();
  const [markedPhoto, setMarkedPhoto] = useState(null);
  const [photoWalkId, setPhotoWalkId] = useState(0);

  useEffect(() => {
    if (route.params?.photo) {
      setMarkedPhoto(route.params.photo);
    }
  }, [route.params?.photo]);

  // Function to open the camera
  const openCamera = async () => {
    const permissionResponse = await requestPermission();
    if (permissionResponse.status !== PermissionStatus.GRANTED) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant camera permissions to use this app."
      );
      return;
    }

    // Launch the camera
    const image = await launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
    });

    if (!image.canceled) {
      await savePhoto(image.assets[0].uri, currentLocation, photoWalkId);
    }
  };

  const mapRef = useRef(null);

  // Get the current location and start tracking
  useEffect(() => {
    if (!currentLocation) {
      getLocation();
    }

    if (isTracking) {
      const interval = setInterval(getLocation, 1000);
      return () => clearInterval(interval);
    }
  }, [currentLocation, isTracking]);

  // Function to get the current location
  const getLocation = () => {
    Location.requestForegroundPermissionsAsync()
      .then(({ status }) => {
        if (status !== "granted") {
          console.log("Permission not granted");
          return;
        }
        return Location.getCurrentPositionAsync({});
      })
      .then((location) => {
        const newCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        if (location) {
          setCurrentLocation(newCoords);
          if (isTracking) {
            setPositions((prevPositions) => {
              if (
                prevPositions.length === 0 ||
                location.coords.latitude !==
                  prevPositions[prevPositions.length - 1].latitude ||
                location.coords.longitude !==
                  prevPositions[prevPositions.length - 1].longitude
              ) {
                return [...prevPositions, newCoords];
              } else {
                return prevPositions;
              }
            });
            handleCenterMap();
          }
        }
      })
      .catch((error) => {
        console.log("Error getting location", error);
      });
  };

  // Function to toggle tracking
  const handleToggleTracking = () => {
    if (isTracking) {
      setPhotoWalkId(0);
      if (positions.length < 2) {
        alert("You need to walk more to record a walk!");
      } else {
        const now = new Date();

        const totalDuration = Math.round((now - startTime) / (1000 * 60));
        setDuration(totalDuration);

        const totalDistance =
          Math.round(calculateTotalDistance(positions) / 100) / 10; // Convert to km
        setDistance(totalDistance);

        setShowMonitor(true);

        handleCenterMap();

        writeToDB("walkRecord", {
          startTime,
          endTime: now,
          positions,
          distance: totalDistance,
          duration: totalDuration,
          photoWalkId,
          like: false,
        });
      }
    } else {
      setPhotoWalkId(new Date().toISOString());
      setStartTime(new Date());
      setPositions([]);
      handleCenterMap();
      setShowMonitor(false);
    }
    setIsTracking((prevIsTracking) => !prevIsTracking);
  };

  // Function to center the map on the current location
  const handleCenterMap = () => {
    if (currentLocation) {
      //console.log(mapRef);
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  };

  // Function to calculate the distance between two points
  const distanceBetween = (from, to) => {
    const options = { units: "meters" };
    const origin = turf.point([from.longitude, from.latitude]);
    const destination = turf.point([to.longitude, to.latitude]);
    return turf.distance(origin, destination, options);
  };

  // Function to calculate the total distance of the walk
  const calculateTotalDistance = (positions) => {
    try {
      let totalDistance = 0;
      for (let i = 1; i < positions.length; i++) {
        const from = positions[i - 1];
        const to = positions[i];
        totalDistance += distanceBetween(from, to);
      }
      return totalDistance;
    } catch (error) {
      return 0;
    }
  };

  if (!currentLocation) {
    return;
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        showsUserLocation={true}
        followsUserLocation={true}
        provider="google"
      >
        <Polyline
          coordinates={positions}
          strokeWidth={8}
          strokeColor={GlobalStyles.colors.secondary}
          lineDashPattern={[1, 0]}
        />
      </MapView>
      {showMonitor && (
        <View style={styles.monitorContainer}>
          <Monitor duration={duration} distance={distance} />
        </View>
      )}
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity style={styles.button} onPress={handleToggleTracking}>
          <Text style={styles.buttonText}>{isTracking ? "End" : "Go"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={openCamera}>
          <FontAwesome5 name="camera-retro" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    backgroundColor: GlobalStyles.colors.secondary,
    padding: 10,
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },
  monitorContainer: {
    position: "absolute",
    width: "100%",
    top: "10%",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 10,
    borderRadius: 10,
    zIndex: 100,
  },
});
