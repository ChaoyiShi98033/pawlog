import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { GlobalStyles } from "../../util/constants/styles";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import PressableButton from "../../util/UI/PressableButton";
import { ButtonStyles } from "../../util/constants/buttonStyles";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import {
  writeToDB,
  updateToDB,
  deleteFromDB,
} from "../../firebase-files/firebaseHelper";

//Component for input related information about a spending history
export default function ItemForm({ item }) {
  const navigation = useNavigation();
  const [category, setCategory] = useState(null);
  const [price, setPrice] = useState("");
  const [show, setShow] = useState(false); //use state for showing calender or not
  const [inputDate, setInputDate] = useState(new Date()); //default the caldendar to show current date
  const [isFirst, setisFirst] = useState(false); //use state for whether calendar set by user for 1st time, default is false

  //State variable that specifies whether the picker is open.
  const [open, setOpen] = useState(false);
  //drop down picker items
  const [categoryItems, setCategoryItems] = useState([
    { label: "Food", value: "Food" },
    { label: "Toy", value: "Toy" },
    { label: "Grooming", value: "Grooming" },
    { label: "Health", value: "Health" },
    { label: "Supplies", value: "Supplies" },
  ]);

  //useEffect to set the item data to the form
  useEffect(() => {
    // console.log('item666 = ', item);
    if (item) {
      setCategory(item.category);
      setPrice(item.price);
      setInputDate(new Date(item.date));
      setisFirst(true);
      navigation.setOptions({
        title: "Edit Item",
        headerRight: () => (
          <PressableButton
            onPressFunction={handleDelete}
            customStyle={{ marginRight: 10, marginBottom: 2 }}
          >
            <FontAwesome
              name="trash"
              size={GlobalStyles.fontSizes.extra_large}
              color={GlobalStyles.colors.dark_grey}
            />
          </PressableButton>
        ),
      });
    }
  }, [item]);

  //function for showing calendar
  const showDatePicker = () => {
    setShow(true);
    setisFirst(true);
    Keyboard.dismiss();
  };

  function validateDate(date) {
    const today = new Date();
    if (date > today) {
      Alert.alert("Please select a valid date!");
      return false;
    }
    return true;
  }

  //calendar change handler
  const dateChangeHandler = (event, selectedDate) => {
    if (validateDate(selectedDate)) {
      setInputDate(selectedDate);
    }
    setShow(false); //hide calender after use
  };

  //handle cancel
  function cancelHandler() {
    navigation.goBack();
  }

  //handle "save"
  const saveHandler = () => {
    //validate duration input
    if (!category) {
      Alert.alert("Please select a category!");
      return;
    }
    //validate cost(price) input
    if (!price || isNaN(price) || price <= 0) {
      Alert.alert("Please enter a valid cost!");
      return;
    }
    //validate there is a date input
    if (isFirst == false) {
      Alert.alert("Please selete a date!");
      return;
    }

    let spendingItem = {
      category,
      price: parseFloat(price),
      date: inputDate,
    };

    //if there is an item, process "Edit", whether save changes or go back
    if (item) {
      Alert.alert("Important", "Are you sure you want to save these changes?", [
        {
          text: "No",
          onPress: () => console.log("No Save Pressed"),
        },
        {
          text: "Yes",
          onPress: () => {
            updateToDB("spendRecord", item.id, spendingItem);
            navigation.goBack();
          },
        },
      ]);
    } else {
      writeToDB("spendRecord", spendingItem); //add a spending to database
      navigation.goBack(); //go back to previous page after "save"
    }
  };

  //"Delete" activity handler
  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this item?",
      [
        {
          text: "No",
          onPress: () => console.log("No delete Pressed"),
        },
        {
          text: "Yes",
          onPress: () => {
            deleteFromDB("spendRecord", item.id);
            navigation.goBack();
          },
        },
      ]
    );
  };


  return (
    <TouchableWithoutFeedback onPress={() => setShow(false)}>
      <View style={styles.container}>
        <View style={styles.pageItems}>
          <Text style={styles.secondary_title}>Category</Text>
          <DropDownPicker
            open={open}
            value={category}
            items={categoryItems}
            setOpen={setOpen}
            setValue={setCategory}
            setItems={setCategoryItems}
            placeholder="Select A Category"
            placeholderStyle={{
              fontSize: GlobalStyles.fontSizes.large,
              color: GlobalStyles.colors.secondary,
            }}
            style={{
              marginBottom: 20,
            }}
            labelStyle={{
              fontSize: GlobalStyles.fontSizes.normal,
            }}
          />
          <Text style={styles.secondary_title}>Spend(dollar)</Text>
          <TextInput
            style={styles.costAndDateBox}
            onChangeText={(text) => setPrice(text)}
            value={price.toString()}
            keyboardType="numeric"
            label="Spend(dollar)"
          />

          <Text style={styles.secondary_title}>Date</Text>
          <TouchableOpacity onPress={showDatePicker}>
            <Text style={styles.dateText}>
              {isFirst ? inputDate.toDateString() : ""}
            </Text>
          </TouchableOpacity>

          {/*           <View style={styles.costAndDateBox}>
            <TextInput style={styles.dateText} onPressIn={showDatePicker}>
              {!isFirst ? "" : inputDate.toDateString()}
            </TextInput>
          </View> */}

          {show && (
            <DateTimePicker
              display="inline"
              testID="dateTimePicker"
              value={inputDate}
              mode="date"
              is24Hour={true}
              onChange={dateChangeHandler}
            />
          )}
        </View>

        {!show && (
          <View style={styles.buttonContainer}>
            <View style={styles.buttonBox}>
              <PressableButton
                customStyle={ButtonStyles.cancelButton}
                onPressFunction={cancelHandler}
                children={"Cancel"}
              />
              <PressableButton
                customStyle={ButtonStyles.saveButton}
                onPressFunction={saveHandler}
                children={"Save"}
              />
            </View>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  secondary_title: {
    fontSize: 16,
    color: GlobalStyles.colors.dark_grey,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pageItems: {
    flex: 5,
    padding: GlobalStyles.paddings.medium,
    marginTop: 30,
    flexDirection: "column",
    justifyContent: "space-arond",
  },
  costAndDateBox: {
    height: 40,
    borderWidth: 2,
    borderColor: GlobalStyles.colors.secondary,
    borderRadius: 5,
    fontSize: GlobalStyles.fontSizes.large,
    width: "100%",
    justifyContent: "center",
    marginBottom: 20,
    color: GlobalStyles.colors.secondary,
    backgroundColor: GlobalStyles.colors.white,
    padding: 10,
  },
  dateText: {
    fontSize: GlobalStyles.fontSizes.large,
    color: GlobalStyles.colors.secondary,
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    borderColor: GlobalStyles.colors.secondary,
    backgroundColor: GlobalStyles.colors.white,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "column",
    marginTop: 30,
  },
  buttonBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "space-around",
  },
});
