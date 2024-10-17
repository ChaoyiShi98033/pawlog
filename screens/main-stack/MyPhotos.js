import { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { getPhotos } from "../../firebase-files/photoService";
import Photo from "../../components/photo/Photo";
import { GlobalStyles } from "../../util/constants/styles";

//My Photo screen displays photos taken by the user
const MyPhotos = () => {
  const [photos, setPhotos] = useState([]);

  const handlePhotoDeleted = (deletedPhotoId) => {
    setPhotos((currentPhotos) =>
      currentPhotos.filter((photo) => photo.id !== deletedPhotoId)
    );
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      const fetchedPhotos = await getPhotos();
      setPhotos(fetchedPhotos);
    };

    fetchPhotos();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        horizontal={false}
        numColumns={3}
        data={photos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Photo photo={item} onDeleted={handlePhotoDeleted} />
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MyPhotos;
