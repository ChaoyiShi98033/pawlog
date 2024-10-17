import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ItemList from "../../components/item/ItemsList";
import IconButton from "../../util/UI/IconButton";
import { GlobalStyles } from "../../util/constants/styles";

//Spend screen displays spending history entered by the user
export default function Spend() {
  const navigation = useNavigation();

  function pressHandler() {
    navigation.navigate("AddItem");
  }

  return (
    <View style={styles.container}>
      <View style={styles.spendItems}>
        <ItemList />
      </View>

      <View style={styles.buttonContainer}>
        <IconButton
          icon="plus-circle"
          size={60}
          color="#81b8a8"
          onPress={pressHandler}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.white,
    justifyContent: "space-between",
  },
  spendItems: {
    flex: 7,
    padding: GlobalStyles.paddings.medium,
    marginTop: 30,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
});
