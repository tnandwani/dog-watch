import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { NativeBaseProvider, Center, Spinner } from "native-base";
import { Provider } from "react-redux";
import store from "./redux/store";
import { MyTheme } from "./constants";

// NAVIGATION
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

// SCREENS
// MAIN
import MainScreen from "./components/Main";
// LANDING
import LandingScreen from "./components/auth/Landing";
import LoginScreen from "./components/auth/Login";
import CreateScreen from "./components/auth/Create";

// VIEW COMPONENTS
import DogCreator from "./components/views/DogCreator"; // holds user tabs
import Personality from "./components/views/Personality";

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export function AppContent() {
  var status = useSelector((state) => state.user.status);

  return (
    <NativeBaseProvider>
      {status == "loading" && (
        <Center flex={1} px="3">
          <Spinner color="indigo.500" />
        </Center>
      )}

      {status == "new" && (
        <NavigationContainer theme={MyTheme}>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen
              name="Landing"
              component={LandingScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Create"
              component={CreateScreen}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}

      {status == "returning" && (
        <NavigationContainer theme={MyTheme}>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen
              name="Main"
              component={MainScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="DogCreator"
              component={DogCreator}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Personality"
              component={Personality}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </NativeBaseProvider>
  );
}
