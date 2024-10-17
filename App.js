import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import React, { useState, useEffect, useCallback } from "react";

import Start from "./screens/auth-stack/Start";
import AddItem from "./screens/main-stack/AddItem";
import Home from "./screens/main-stack/Home";
import MyWalks from "./screens/main-stack/MyWalks";
import Walk from "./screens/main-stack/Walk";
import Spend from "./screens/main-stack/Spend";
import Notification from "./screens/main-stack/Notification";
import MyProfile from "./screens/main-stack/MyProfile";
import MyPhotos from "./screens/main-stack/MyPhotos";
import EditItem from "./screens/main-stack/EditItem";
import WalkRecord from "./screens/main-stack/WalkRecord";
import LogIn from "./screens/auth-stack/LogIn";
import SignUp from "./screens/auth-stack/SignUp";
import PhotoForm from "./screens/main-stack/PhotoForm";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-files/firebaseSetup";
import * as Notifications from "expo-notifications";
import { GlobalStyles } from "./util/constants/styles";
import { Dimensions } from "react-native";
import Community from "./screens/main-stack/Community";

const { width, height } = Dimensions.get("window");

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, justifyContent: "space-between" }}
    >
      <View>
        <DrawerItemList {...props} />
        <DrawerItem
          label="My Profile"
          onPress={() => {
            props.navigation.navigate("MyProfile");
          }}
        />
        <DrawerItem
          label="My Photos"
          onPress={() => {
            props.navigation.navigate("MyPhotos");
          }}
        />
        <DrawerItem
          label="My Walks"
          onPress={() => {
            props.navigation.navigate("MyWalks");
          }}
        />
      </View>
      <View style={{ marginBottom: height * 0.05 }}>
        <DrawerItem
          label="Log Out"
          onPress={() => {
            auth.signOut();
          }}
        />
      </View>
    </DrawerContentScrollView>
  );
}

function OverviewTabs() {
  return (
    <BottomTabs.Navigator>
      <BottomTabs.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" color={color} size={20} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="Walk"
        component={Walk}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="paw" color={color} size={20} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="Community"
        component={Community}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="users" color={color} size={20} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="Spend"
        component={Spend}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="money" color={color} size={20} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="Notification"
        component={Notification}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bell" color={color} size={20} />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
}

// Drawer Navigator
function DrawerNavigation() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="PAWLOG" component={OverviewTabs} />
      {/* <Drawer.Screen name="My Profile" component={MyProfile} /> */}
      {/* <Drawer.Screen name="My Photos" component={MyPhotos} /> */}
      {/* <Drawer.Screen name="My Spending" component={MySpending} /> */}
    </Drawer.Navigator>
  );
}

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    roboto: require("./assets/fonts/Roboto-Light.ttf"),
  });
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserLoggedIn(true);
      } else {
        setUserLoggedIn(false);
      }
    });
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const AuthStack = (
    <>
      <Stack.Screen
        name="Start"
        component={Start}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LogIn"
        component={LogIn}
        options={{ headerShown: false }}
      />
    </>
  );

  const MainStack = (
    <>
      <Stack.Screen
        name="Back"
        component={DrawerNavigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyWalks"
        component={MyWalks}
        options={{ title: "My Walks" }}
      />
      <Stack.Screen
        name="MyProfile"
        component={MyProfile}
        options={{ title: "My Profile" }}
      />
      <Stack.Screen
        name="MyPhotos"
        component={MyPhotos}
        options={{ title: "My Photos" }}
      />
      <Stack.Screen name="PhotoForm" component={PhotoForm} />
      <Stack.Screen
        name="AddItem"
        component={AddItem}
        options={{
          // presentation: "modal"
          title: "Add Item",
        }}
      />
      <Stack.Screen
        name="EditItem"
        component={EditItem}
        options={{ title: "Edit Item" }}
      />
      <Stack.Screen name="Walk Record" component={WalkRecord} />
    </>
  );

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator>
          {userLoggedIn ? MainStack : AuthStack}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: GlobalStyles.colors.primary,
    justifyContent: "center",
  },
});
