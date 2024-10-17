import {
  collection,
  setDoc,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  deleteObject,
  listAll,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { database, auth } from "./firebaseSetup";
import { Alert } from "react-native";

// CRUD
// Create
export async function createUserInDB(data) {
  try {
    const docRef = await setDoc(
      doc(database, "users", auth.currentUser.uid),
      data
    );
    console.log("User added to DB: ", docRef.id);
  } catch (err) {
    console.log("createUserInDB error:", err);
  }
}

export async function createPlanInDB(data) {
  try {
    const fullData = {
      createdBy: auth.currentUser.uid,
      participants: [auth.currentUser.uid],
      ...data,
    };
    const docRef = await addDoc(collection(database, "plans"), fullData);
    console.log("Plan added to DB: ", docRef.id);

    return docRef.id;
  } catch (err) {
    console.log("createPlanInDB error:", err);
  }
}

// export async function addRecordToUserInDB(collectionName, data) {
//   try {
//     const docRef = await addDoc(
//       collection(database, "users", auth.currentUser.uid, collectionName),
//       data
//     );
//     console.log("Record added to DB: ", docRef.id);
//   } catch (err) {
//     console.log("addRecordToUserInDB error:", err);
//   }
// }

export async function writeToDB(collectionName, data) {
  try {
    if (collectionName === "users") {
      const docRef = await setDoc(
        doc(database, "users", auth.currentUser.uid),
        data
      );
      console.log("User added to DB: ", auth.currentUser.uid);
    } else if (collectionName === "plans") {
      const newData = {
        createdBy: auth.currentUser.uid,
        ...data,
      };
      const docRef = await addDoc(collection(database, "plans"), newData);
      console.log("Plan added to DB: ", docRef.id);
    } else {
      const docRef = await addDoc(
        collection(database, "users", auth.currentUser.uid, collectionName),
        data
      );
    }
  } catch (err) {
    console.log("error from writeToDB: ", err);
  }
}

export async function writeProfilePhotoToDB(imageURI) {
  try {
    const profileImgPath = `profileImages/${auth.currentUser.uid}`;
    const storageRef = ref(getStorage(), profileImgPath);
    const response = await fetch(imageURI);
    const blob = await response.blob();
    await uploadBytesResumable(storageRef, blob);
    const photoURL = await getDownloadURL(storageRef);
    console.log("upload profile photo successful:", photoURL);
    return photoURL;
  } catch (err) {
    console.log("writeProfilePhotoToDB error:", err);
  }
}

export async function addAlarmToDB(planId, notificationId, date) {
  try {
    const docRef = await setDoc(doc(database, "users", auth.currentUser.uid, "alarms", planId), {
      date, notificationId
    });
    console.log("Alarm added to DB");
  } catch (err) {
    console.log("addAlarmToDB error:", err);
  }
}

// Read
export async function readFromDB(
  collectionName,
  documentId,
  queryConditions = null
) {
  try {
    const parentDocRef = doc(database, "users", auth.currentUser.uid);
    const subcollectionRef = collection(parentDocRef, collectionName);

    let queryRef;
    let docSnap;
    if (documentId) {
      // console.log(`reading ${collectionName}: ${documentId}`);
      queryRef = doc(subcollectionRef, documentId);
      docSnap = await getDoc(queryRef);
      return docSnap.data();
    } else {
      queryRef = query(subcollectionRef, ...queryConditions);
      docSnap = await getDocs(queryRef);
      if (!docSnap.empty) {
        const records = docSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return records;
      } else {
        // console.log("No such document");
        return [];
      }
    }
  } catch (err) {
    console.error("Error reading documents:", err);
    throw err;
  }
}

export async function getRecordsFromLastWeek(collectionName, dateAttribute) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  return await readFromDB(collectionName, null, [
    where(dateAttribute, ">=", startDate),
  ]);
}

export async function getWalksForToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  //console.log("today:", today);
  const ref = collection(database, "users", auth.currentUser.uid, "walks");
  const q = query(ref, where("date", ">=", today));
  const walksSnapshot = await getDocs(q);
  return walksSnapshot.size;
}

export async function getPushTokenFromDB(userId) {
  const docRef = doc(database, "users", userId);
  try {
    const docSnap = await getDoc(docRef);
    return docSnap.data().pushToken;
  } catch (err) {
    console.log("getPushTokenFromDB error:", err);
  }
}

export async function getPlanFromDB(planId) {
  try {
    const docRef = doc(database, "plans", planId);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  } catch (err) {
    console.log("getPlan error:", err);
  }
}

export async function getUserInfoFromDB(userId) {
  try {
    const docRef = doc(database, "users", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  } catch (err) {
    console.log("getUserInfoFromDB error:", err);
  }
}

// Update
export async function updateProfileImage(imageURI) {
  try {
    const docRef = doc(database, "users", auth.currentUser.uid);
    await updateDoc(docRef, { profileImage: imageURI });
  } catch (err) {
    console.log("updateProfileImage error:", err);
  }
}

export async function updateToDB(subcollectionName, documentId, data) {
  let docRef;
  if (!subcollectionName && !documentId) {
    docRef = doc(database, "users", auth.currentUser.uid);
  } else {
    docRef = doc(
      database,
      "users",
      auth.currentUser.uid,
      subcollectionName,
      documentId
    );
  }
  try {
    await updateDoc(docRef, data);
  } catch (err) {
    console.log("updateToDB error:", err);
  }
}

export async function joinPlanInDB(planId, userId) {
  try {
    const docRef = doc(database, "plans", planId);
    const docSnap = await getDoc(docRef);
    const { participants } = docSnap.data();
    if (participants) {
      const isUserExist = participants.includes(userId);
      if (isUserExist) {
        Alert.alert("You have already applied to this plan");
        return false;
      }
      participants.push(userId);
      await updateDoc(docRef, { participants });
    } else {
      await updateDoc(docRef, { participants: [userId] });
    }
    console.log("User added to plan");
    return true;
  } catch (err) {
    console.log("joinPlan error:", err);
  }
}

export async function quitPlanFromDB(planId, userId) {
  try {
    const docRef = doc(database, "plans", planId);
    const docSnap = await getDoc(docRef);
    const { participants } = docSnap.data();
    const updatedParticipants = participants.filter(
      (participant) => participant !== userId
    );
    await updateDoc(docRef, { participants: updatedParticipants });
    console.log("User quit the plan");
  } catch (err) {
    console.log("quitPlan error:", err);
  }
}

export async function updatePlanInDB(planId, data) {
  try {
    const docRef = doc(database, "plans", planId);
    await updateDoc(docRef, data);
    console.log("Plan updated in DB");
  } catch (err) {
    console.log("updatePlan error:", err);
  }
}

export async function updateAlarmInDB(planId, newNotificationId, newDate) {
  try {
    const docRef = doc(database, "users", auth.currentUser.uid, "alarms", planId);
    const oldNotificationId = (await getDoc(docRef)).data().notificationId;
    await updateDoc(docRef, { date: newDate, notificationId: newNotificationId });
    console.log("Alarm updated in DB");
    return oldNotificationId;
  } catch (err) {
    console.log("updateAlarm error:", err);
  }
}


// Delete
export async function deleteFromDB(collectionName, documentId) {
  try {
    if (!documentId && !collectionName) {
      // delete all subcollections of the user
      const userDocRef = doc(database, "users", auth.currentUser.uid);
      await deleteAllSubcolOfUser(userDocRef);
      // delete user document
      await deleteDoc(userDocRef);  
      console.log("User deleted from DB");    
    } else {
      const docRef = doc(
        database,
        "users",
        auth.currentUser.uid,
        collectionName,
        documentId
      );
      await deleteDoc(docRef);
    }
    console.log("Document deleted from DB");
  } catch (err) {
    console.log("deleteFromDB error:", err);
  }
}

export async function deleteAllSubcolOfUser(parentDocRef) {
  const collections = [
    "photos",
    "alarms",
    "notifications",
    "walkRecord",
    "spendRecord",
  ];
  for (let collectionName of collections) {
    const subcollectionRef = collection(parentDocRef, collectionName);
    const subcollectionDocs = await getDocs(subcollectionRef);
    subcollectionDocs.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  }
}

export async function deleteUserFromDB() {
  try {
    // delete all plans of the user
    await deletePlansOfUser();
    // quit all plans of the user
    await quitPlansOfUser();
    // delete all subcollections of the user
    await deleteFromDB();
    // delete photos of the user
    await deletePhotosOfUser();
  } catch (err) {
    console.log("deleteUserFromDB error:", err);
  }
}

export async function deletePhotosOfUser() {
  try {
    const folderPath = `photos/${auth.currentUser.uid}`;
    const listRef = ref(getStorage(), folderPath);

    const res = await listAll(listRef);
    res.items.forEach((itemRef) => {
      deleteObject(itemRef);
    });

    const profileImgPath = `profileImages/${auth.currentUser.uid}`;
    const profileImgRef = ref(getStorage(), profileImgPath);
    deleteObject(profileImgRef);

    console.log("Photos deleted successfully");
  } catch (err) {
    console.log("deletePhotosOfUser error:", err);
  }
}

export async function deletePlanFromDB(planId) {
  try {
    const docRef = doc(database, "plans", planId);
    await deleteDoc(docRef);
    console.log("Plan deleted from DB");
  } catch (err) {
    console.log("deletePlan error:", err);
  }
}

export async function deleteAlarmFromDB(planId) {
  try {
    const docRef = doc(database, "users", auth.currentUser.uid, "alarms", planId);
    const notificationId = (await getDoc(docRef)).data().notificationId;
    await deleteDoc(docRef);
    console.log("Alarm deleted from DB");
    return notificationId;
  } catch (err) {
    console.log("deleteAlarm error:", err);
  }
}

export async function deletePlansOfUser() {
  console.log("Deleting all plans of the user")
  try {
    const plansRef = collection(database, "plans");
    const q = query(plansRef, where("createdBy", "==", auth.currentUser.uid));
    const plansSnapshot = await getDocs(q);
    plansSnapshot.forEach(async (doc) => {
      await deletePlanFromDB(doc.id);
    });
    console.log("All plans of the user deleted");
  } catch (err) {
    console.log("deleteAllPlansOfUser error:", err);
  }
}

export async function quitPlansOfUser() {
  try {
    const plansRef = collection(database, "plans");
    const q = query(plansRef, where("participants", "array-contains", auth.currentUser.uid));
    const plansSnapshot = await getDocs(q);
    plansSnapshot.forEach(async (doc) => {
      await quitPlanFromDB(doc.id, auth.currentUser.uid);
    });
    console.log("User quit all plans");
  } catch (err) {
    console.log("quitPlansOfUser error:", err);
  }
}