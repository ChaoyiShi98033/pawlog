import { StyleSheet, Text, View, Dimensions, TextInput, Modal, TouchableOpacity, FlatList, Image, Platform, Keyboard, ScrollView } from 'react-native';
import React, {useEffect, useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  createPlanInDB,
  getPlanFromDB,
  getUserInfoFromDB,
  joinPlanInDB,
  updatePlanInDB,
  quitPlanFromDB,
  updateAlarmInDB,
  addAlarmToDB,
} from '../../firebase-files/firebaseHelper';
import {auth} from '../../firebase-files/firebaseSetup';
import {sendPushNotifications} from '../notification/PushNotification';
import {
  setLocalNotification,
  cancelLocalNotification,
} from '../notification/LocalNotification';
import {GlobalStyles} from '../../util/constants/styles';
import PressableButton from '../../util/UI/PressableButton';
import {ButtonStyles} from '../../util/constants/buttonStyles';
import { dateToString, timeToString, stringToDate, stringToTime } from '../../util/helper';

const {width, height} = Dimensions.get ('window');

// InputField component
const InputField = ({label, value, onChangeText, editable}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.labelText}>{label}</Text>
    {editable ? (
      <TextInput
        style={[styles.inputContent, styles.textContent]}
        value={value}
        onChangeText={onChangeText}
      />
    ) : (
      <Text style={styles.textContent}>{value}</Text>
    )}
  </View>
);
// DateTimeField component
const DateTimeField = ({ label, dateValue, onDateChange, timeValue, onTimeChange, editable }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.labelText}>{label}</Text>
    {editable ? (
      <View style={[styles.inputContent, styles.textContent]}>
        <TouchableOpacity onPress={onDateChange}>
          <Text>{dateValue ? dateToString(dateValue) : 'Date'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onTimeChange}>
          <Text>{timeValue ? timeToString(timeValue) : 'Time'}</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <Text style={styles.textContent}>
        {dateToString(dateValue)} {timeToString(timeValue)}
      </Text>
    )}
  </View>
);
// ParticipantsField component
const ParticipantsField = (data) => (
  <View style={styles.inputContainer}>
    <View style={styles.inputLabel}>
      <Text style={styles.labelText}>Who</Text>
    </View>
    <FlatList
      data={data.participants}
      renderItem={({item}) => (
        <Image
          source={
            item.userImage
              ? {uri: item.userImage}
              : require ('../../assets/logo.png')
          }
          style={styles.image}
        />
      )}
      keyExtractor={item => item.userId}
      style={styles.listContainer}
      horizontal={true}
    />
  </View>
);
// DateTimePickerField component
const DateTimePickerField = ({value, onChange, mode, display}) => (
  <DateTimePicker
    value={value}
    mode={mode}
    display={display}
    themeVariant="light"
    onChange={onChange}
    is24Hour={true}
  />
)
// ButtonField component
const ButtonField = ({leftButtonStyle, leftButtonFunction, leftButtonChildren, rightButtonStyle, rightButtonFunction, rightButtonChildren}) => (
  <>
    <PressableButton
      customStyle={leftButtonStyle}
      onPressFunction={leftButtonFunction}
      children={leftButtonChildren}
    />
    <PressableButton
      customStyle={rightButtonStyle}
      onPressFunction={rightButtonFunction}
      children={rightButtonChildren}
    />
  </>
)
// WalkPlanner component
export default function WalkPlanner({visible, dismissModal, planId}) {
  const [planData, setPlanData] = useState ({
    creator: null,
    location: { startCity: null, startLocation: null },
    participants: [],
    isEditable: true,
    isParticipant: false,
    showTimePicker: false,
    showDatePicker: false,
    time: null,
    date: null,
  });

  useEffect (() => {
    // Fetch plan data from database
    async function fetchPlan() {
      const plan = await getPlanFromDB(planId);
      setPlanData({
        creator: plan.createdBy,
        location: { startCity: plan.city, startLocation: plan.location },
        isEditable: plan.createdBy === auth.currentUser.uid,
        isParticipant: plan.participants.includes(auth.currentUser.uid),
        participants: await fetchParticipantsData(plan.participants),
        showTimePicker: false,
        showDatePicker: false,
        time: stringToTime(plan.time),
        date: stringToDate(plan.date),
      });
    }
    // If planId is not null, fetch plan data
    if (planId) {
      fetchPlan ();
    }
  }, [planId]);

  // Fetch participants data from database
  async function fetchParticipantsData(participants) {
    const participantsData = [];
    for (const participant of participants) {
      const participantData = await getUserInfoFromDB(participant);
      participantsData.push({
        userId: participant,
        userImage: participantData.profileImage,
      });
    }
    return participantsData;
  }

  // Handle date change
  function handleDateChange(event, selectedDate) {
    if (Platform.OS === 'ios') {
      setPlanData({...planData, date: selectedDate});
    } else if (Platform.OS === 'android' && event.type === 'set') {
      setPlanData({...planData, date: selectedDate, showDatePicker: false});
    } else if (Platform.OS === 'android' && event.type === 'dismissed') {
      setPlanData({...planData, showDatePicker: false});
    }
  }

  // Handle time change
  function handleTimeChange(event, selectedTime) {
    if (Platform.OS === 'ios') {
      setPlanData({...planData, time: selectedTime});
    } else if (Platform.OS === 'android' && event.type === 'set') {
      setPlanData({...planData, time: selectedTime, showTimePicker: false});
    } else if (Platform.OS === 'android' && event.type === 'dismissed') {
      setPlanData({...planData, showTimePicker: false});
    }
  }

  // Remove content from the planner
  function removeContent () {
    setPlanData({
      creator: null,
      location: { startCity: null, startLocation: null },
      participants: [],
      isEditable: true,
      isParticipant: false,
      showTimePicker: false,
      showDatePicker: false,
      time: null,
      date: null,
    });
  }

  // Get the true date and time
  function getTrueDate () {
    const {date, time} = planData;
    const trueDate = new Date ();
    trueDate.setFullYear (date.getFullYear (), date.getMonth (), date.getDate ());
    trueDate.setHours( time.getHours (), time.getMinutes (), 0, 0 );
    return trueDate;
  }

  // Validate input
  function validateInput () {
    const {date, time, location} = planData;
    if (!date || !time) {
      alert ('No date or time selected');
      return false;
    }
    const trueDate = getTrueDate ();

    if (trueDate < new Date ()) {
      alert ('Future date and time required');
      return false;
    } else if (!location.startCity || !location.startLocation) {
      alert ('No city or location selected');
      return false;
    }
    return true;
  }

  // Submit handler
  async function submitHandler () {
    if (!validateInput ()) {
      return;
    }
    dismissModal ();
    const {date, time, location} = planData;
    const planId = await createPlanInDB ({
      date: dateToString (date),
      time: timeToString (time),
      city: location.startCity,
      location: location.startLocation,
    });
    
    const trueDate = getTrueDate ();
    const notificationId = await setLocalNotification (trueDate);
    await addAlarmToDB (planId, notificationId, trueDate);
    removeContent ();
  }

  // Update handler
  async function updateHandler () {
    if (!validateInput ()) {
      return;
    }
    dismissModal ();
    removeContent ();

    const { date, time, location, participants } = planData;

    // Update plan in database
    const updatedPlan = {
      date: dateToString (date),
      time: timeToString (time),
      city: location.startCity,
      location: location.startLocation,
    }

    await updatePlanInDB (planId, updatedPlan);

    // Send push notifications to all participants except the creator
    const message = `${dateToString (date)} ${timeToString (time)} ${location.startCity}, ${location.startLocation}.`;
    participants.forEach (async (participant) => {
      participant.userId !== auth.currentUser.uid &&
        await sendPushNotifications (participant.userId, {
          title: 'Walk Plan Update',
          body: message,
        });
    });

    // Update alarm in database
    const trueDate = getTrueDate ();
    const notificationId = await setLocalNotification (trueDate);
    const oldNotificationId = await updateAlarmInDB ( planId, notificationId, trueDate );
    await cancelLocalNotification (oldNotificationId);
  }

  // Update handler for participants
  async function updateParticipantHandler () {
    const {creator, isParticipant} = planData;

    if (isParticipant) {
      await quitPlanFromDB (planId, auth.currentUser.uid);
    } else {
      await joinPlanInDB (planId, auth.currentUser.uid);
    }
    await sendPushNotifications (creator, {
      title: 'Walk Plan Update',
      body: isParticipant
        ? `${auth.currentUser.displayName} quit your walk!`
        : `${auth.currentUser.displayName} joined your walk!`,
    });
    dismissModal ();
  }

  // Close handler
  function closeHandler () {
    dismissModal ();
    removeContent ();
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <ScrollView contentContainerStyle={{flexGrow:1}}>
        <View style={styles.modalContainer}>
          <View style={styles.topContainer}>
            <View style={styles.planTitleContainer}>
              <Text style={styles.plannerTitle}>Dog Walk Planner</Text>
            </View>
            <InputField
              label="City"
              value={planData.location.startCity}
              editable={planData.isEditable}
              onChangeText={text => setPlanData({...planData, location: {...planData.location, startCity: text}})}
            />
            <InputField
              label="Place"
              value={planData.location.startLocation}
              editable={planData.isEditable}
              onChangeText={text => setPlanData({...planData, location: {...planData.location, startLocation: text}})}
            />
            <DateTimeField
              label="When"
              dateValue={planData.date}
              onDateChange={() => setPlanData({
                ...planData, 
                showDatePicker: !planData.showDatePicker, 
                showTimePicker: false,
                date: planData.date || new Date(),
              })}
              timeValue={planData.time}
              onTimeChange={() => setPlanData({
                ...planData, 
                showTimePicker: !planData.showTimePicker, 
                showDatePicker: false,
                time: planData.time || new Date(),
              })}
              editable={planData.isEditable}
            />
            {planId && <ParticipantsField participants={planData.participants}/>}
          </View>
          <View style={styles.middleContainer}>
            {planData.showDatePicker && (
              <DateTimePickerField
                value={planData.date}
                onChange={handleDateChange}
                mode="date"
                display="inline"
              />
            )}
            {planData.showTimePicker && (
              <DateTimePickerField
                value={planData.time}
                onChange={handleTimeChange}
                mode="time"
                display="spinner"
              />
            )}
          </View>
          <View style={styles.bottomContainer}>
            { planData.showDatePicker || planData.showTimePicker ? null // datetimepicker is open then no buttons
            : planData.isEditable // isEditable is true then the user is the creator
            ? planId 
            ? ( // planId is true then the user is updating a plan
              <ButtonField
                leftButtonStyle={ButtonStyles.cancelButton}
                leftButtonFunction={closeHandler}
                leftButtonChildren={'Close'}
                rightButtonStyle={ButtonStyles.saveButton}
                rightButtonFunction={updateHandler}
                rightButtonChildren={'Update'}
              />
            ) : ( // planId is false then the user is creating a plan
              <ButtonField
                leftButtonStyle={ButtonStyles.cancelButton}
                leftButtonFunction={closeHandler}
                leftButtonChildren={'Close'}
                rightButtonStyle={ButtonStyles.saveButton}
                rightButtonFunction={submitHandler}
                rightButtonChildren={'Submit'}
              />
            ) : ( // isEditable is false then the user is a participant
              <ButtonField
                leftButtonStyle={ButtonStyles.cancelButton}
                leftButtonFunction={closeHandler}
                leftButtonChildren={'Close'}
                rightButtonStyle={ButtonStyles.saveButton}
                rightButtonFunction={updateParticipantHandler}
                rightButtonChildren={planData.isParticipant ? 'Quit' : 'Join'} // isParticipant is true then the user is quitting the plan
              />
            )}
            </View>
        </View>
      </ScrollView>
    </Modal>
  );
}


const styles = StyleSheet.create ({
  modalContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: height * 0.1,
    paddingHorizontal: width * 0.05,
  },
  inputContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginBottom: 10,
    marginTop: 10,
  },
  inputLabel: {
    width: width * 0.15,
    mariginRight: 5,
    marginBottom: 5,
  },
  labelText: {
    fontWeight: 'bold',
    color: GlobalStyles.colors.dark_grey,
    fontSize: GlobalStyles.fontSizes.large,
  },
  inputContent: {
    borderWidth: 2,
    borderColor: GlobalStyles.colors.secondary,
    borderRadius: 5,
  },
  textContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 0.8,
    paddingVertical: 5,
    paddingLeft: 5,
  },
  listContainer: {
    margin: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 2,
  },
  topContainer: {
    flex: 0.3,
  },
  middleContainer: {
    flex: 0.4,
    justifyContent: 'center',
  },
  bottomContainer: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  plannerTitle: {
    fontSize: GlobalStyles.fontSizes.extra_large,
    color: GlobalStyles.colors.dark_grey,
    fontWeight: 'bold',
  },
  planTitleContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  cityLocationText:{
    paddingLeft: 3,
  },
});
