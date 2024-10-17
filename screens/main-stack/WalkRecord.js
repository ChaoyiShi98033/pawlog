import { StyleSheet, View, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { GlobalStyles } from "../../util/constants/styles";
import { getPhotosOfWalk } from "../../firebase-files/photoService";

// WalkRecord screen to display a walk record
export default function WalkRecord() {
  const route = useRoute();

  const { positions, startTime, endTime, photoWalkId } = route.params.data[0];
  const [region, setRegion] = useState({});
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    zoom();
    getPhotoFromDB();
  }, []);

  // Function to get photos from the database
  async function getPhotoFromDB() {
    const photos = await getPhotosOfWalk(photoWalkId);
    setPhotos(photos);
  }

  // Function to zoom the map
  function zoom() {
    // Calculate bounding box
    const minLat = Math.min(...positions.map((coord) => coord.latitude));
    const maxLat = Math.max(...positions.map((coord) => coord.latitude));
    const minLng = Math.min(...positions.map((coord) => coord.longitude));
    const maxLng = Math.max(...positions.map((coord) => coord.longitude));

    // Calculate center
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    // Calculate deltas
    const deltaLat = maxLat - minLat;
    const deltaLng = maxLng - minLng;

    // Set map region
    const region = {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: deltaLat * 1.5,
      longitudeDelta: deltaLng * 1.5,
    };
    setRegion(region);
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} provider="google">
        <Polyline
          coordinates={positions}
          strokeWidth={8}
          strokeColor={GlobalStyles.colors.secondary}
          lineDashPattern={[1, 0]}
        />
        <Marker
          coordinate={positions[0]}
          title="Start"
          description={startTime}
          pinColor="green"
        />
        <Marker
          coordinate={positions[positions.length - 1]}
          title="End"
          description={endTime}
        />
        {photos.map((photo, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: photo.location.latitude,
              longitude: photo.location.longitude,
            }}
          >
            <View style={styles.customMarker}>
              <Image
                source={{ uri: photo.imageUrl }}
                style={styles.markerImage}
              />
            </View>
          </Marker>
        ))}
      </MapView>
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
  customMarker: {
    alignItems: "center",
    width: 100,
    padding: 5,
  },
  markerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
  },
  markerText: {
    color: "#333",
    fontSize: 12,
    marginTop: 5,
  },
});
