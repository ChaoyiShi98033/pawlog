import { StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import React, {useEffect, useState} from 'react';
import WalkPlanner from '../../components/walk/WalkPlanner';
import {onSnapshot, collection} from 'firebase/firestore';
import {database, auth} from '../../firebase-files/firebaseSetup';
import {FontAwesome5, AntDesign} from '@expo/vector-icons';
import { deletePlanFromDB, deleteAlarmFromDB, getPlanFromDB } from '../../firebase-files/firebaseHelper';
import { cancelLocalNotification } from '../../components/notification/LocalNotification';
import { sendPushNotifications } from '../../components/notification/PushNotification';
import {GlobalStyles} from '../../util/constants/styles';
import {FontAwesome} from '@expo/vector-icons';

// Community screen to display all walk plans
export default function Community () {
  const [showModal, setShowModal] = useState (false);
  const [plans, setPlans] = useState ([]);
  const [planId, setPlanId] = useState (null);

  useEffect (() => {
    const subscribe = onSnapshot (collection (database, 'plans'), snapshot => {
      const plans = snapshot.docs.map (doc => ({id: doc.id, ...doc.data ()}));
      setPlans (plans);
    });
    return () => subscribe ();
  }, []);

  // delete a walk plan
  async function deleteHandler (planId) {
    const plan = await getPlanFromDB (planId);
    console.log (plan.participants);
    plan.participants.forEach (participant => {
      participant !== auth.currentUser.uid &&
        sendPushNotifications (participant, {
          title: 'Walk Plan Cancelled',
          body: `${plan.date} ${plan.time} ${plan.city}, ${plan.location}.`,
        });
    });

    await deletePlanFromDB (planId);
    const notificationId = await deleteAlarmFromDB (planId);
    await cancelLocalNotification (notificationId);
  }

  // open a walk plan
  async function openPlanHandler (planId) {
    setPlanId (planId);
    setShowModal (true);
  }

  // create a new walk plan
  function newPlanHandler () {
    setPlanId (null);
    setShowModal (true);
  }

  // dismiss the modal
  function dismissModal () {
    setShowModal (false);
    setPlanId (null);
  }

  return (
    <View style={styles.container}>
      <WalkPlanner
        visible={showModal}
        dismissModal={dismissModal}
        planId={planId}
      />
      <FlatList
        data={plans}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.planContainer}
            onPress={() => openPlanHandler (item.id)}
          >
            <View style={styles.planTextContainer}>
              <Text style={styles.planDateText}>{item.date} {item.time}</Text>
              <Text style={styles.planRouteText}>
                <FontAwesome name="map-pin" size={14} color={GlobalStyles.colors.red} />
                {'  '}{item.city}{', '}{item.location}
              </Text>
            </View>
            {item.createdBy !== auth.currentUser.uid
              ? item.participants.includes (auth.currentUser.uid)
                  ? <View style={styles.checkButtonContainer}>
                      <AntDesign name="checksquareo" size={24} color="black" />
                    </View>
                  : null
              : <TouchableOpacity
                  onPress={() => deleteHandler (item.id)}
                  style={styles.existingPlanButton}
                >
                  <AntDesign name="delete" size={height / 50} color="black" />
                </TouchableOpacity>}
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity onPress={newPlanHandler} style={styles.newPlanButton}>
        <FontAwesome5 name="plus-circle" size={50} color="#81b8a8" />
      </TouchableOpacity>
    </View>
  );
}

const {width, height} = Dimensions.get ('window');

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  newPlanButton: {
    padding: 10,
    margin: 30,
    borderRadius: 5,
    alignItems: 'center',
  },
  planContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    margin: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    height: height > 1000 ? height * .07 : height * 0.1,
    backgroundColor: GlobalStyles.colors.white,
  },
  existingPlanButton: {
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownPlanText: {
    width: width * 0.3,
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkButtonContainer: {
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planTextContainer: {
    flex: 1,
    justifyContent: 'space-around',
  },
  planDateText: {
    color: GlobalStyles.colors.dark_grey,
    fontSize: GlobalStyles.fontSizes.large,
    fontWeight: 'bold',
  },
  planRouteText: {
    color: GlobalStyles.colors.dark_grey,
    fontSize: GlobalStyles.fontSizes.large,
  },
});
