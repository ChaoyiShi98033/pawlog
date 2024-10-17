import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { database, auth } from "./firebaseSetup";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

// Function to save a photo to Firestore and Firebase Storage
export async function savePhoto(imageUri, location, photoWalkId) {
  try {
    // Step 1: Create a new document in Firestore to generate a unique ID
    const docRef = await addDoc(
      collection(database, "users", auth.currentUser.uid, "photos"),
      {
        // Initial data can be empty or any placeholder values
        timestamp: new Date(),
      }
    );

    // Step 2: Use the generated document ID to create a file name
    const photoId = docRef.id; // Firestore document ID
    const fileName = `photos/${auth.currentUser.uid}/${photoId}`;
    const storageRef = ref(getStorage(), fileName);

    // Step 3: Upload the photo to Firebase Storage
    const response = await fetch(imageUri);
    const blob = await response.blob();
    await uploadBytes(storageRef, blob);

    // Step 4: Get the photo URL after uploading
    const photoURL = await getDownloadURL(storageRef);

    // Step 5: Update the Firestore document with the photo metadata
    await updateDoc(
      doc(database, "users", auth.currentUser.uid, "photos", photoId),
      {
        imageUrl: photoURL,
        location: location,
        photoWalkId: photoWalkId,
        storagePath: fileName, // Storing the storage path is optional but helpful for deletion
      }
    );

    console.log("Photo saved successfully: ", photoURL);
  } catch (error) {
    console.error("Error saving photo: ", error);
    throw error; // Rethrow the error so it can be caught by the caller
  }
}

// Function to fetch all user's photos from Firestore
export async function getPhotos() {
  const photos = [];
  const querySnapshot = await getDocs(
    collection(database, "users", auth.currentUser.uid, "photos")
  );
  querySnapshot.forEach((doc) => {
    photos.push({ id: doc.id, ...doc.data() });
  });
  return photos;
}

export async function getPhotosOfWalk(photoWalkId) {
  const photos = [];
  const querySnapshot = await getDocs(
    query(
      collection(database, "users", auth.currentUser.uid, "photos"),
      where("photoWalkId", "==", photoWalkId)
    )
  );
  querySnapshot.forEach((doc) => {
    photos.push({ id: doc.id, ...doc.data() });
  });
  return photos;
}


// Function to delete a photo from Firestore and Firebase Storage
export async function deletePhoto(photoId) {
  try {
    // Construct the file path using the photoId
    const filePath = `photos/${auth.currentUser.uid}/${photoId}`;
    const storageRef = ref(getStorage(), filePath);

    // Delete the file from Storage
    await deleteObject(storageRef);

    // Delete the Firestore document
    await deleteDoc(
      doc(database, "users", auth.currentUser.uid, "photos", photoId)
    );

    console.log("Photo deleted successfully");
  } catch (error) {
    console.error("Error deleting photo: ", error);
    throw error;
  }
}

export const markPhotoOnMap = async (photo) => {
  await addDoc(collection(database, "markedPhotos"), {
    imageUrl: photo.imageUrl,
    location: photo.location,
    timestamp: new Date(),
  });
};

export const getMarkedPhotos = async () => {
  const querySnapshot = await getDocs(collection(database, "markedPhotos"));
  const photos = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    photos.push({
      id: doc.id,
      ...data,
      location: data.location, // Make sure this matches your data structure
    });
  });
  return photos;
};
