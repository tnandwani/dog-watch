// REACT
import React, { useEffect } from 'react';
import { Platform, View } from 'react-native';
//Sentry setup 
import * as Sentry from 'sentry-expo';

// UI
import { NativeBaseProvider, Center, Spinner } from "native-base";
import { MyTheme, sentryKey } from "./constants";

// REDUX
import { useSelector, Provider } from "react-redux";
import store from "./redux/store";

// NAVIGATION
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();
// LANDING
import LandingScreen from "./components/auth/Landing";
import LoginScreen from "./components/auth/Login";
import CreateScreen from "./components/auth/Create";
import ExploreScreen from "./components/tabs/ExploreTab";

// TAB HOLDER
import MainScreen from "./components/Main";
// VIEW COMPONENTS
import DogCreator from "./components/views/DogCreator"; // holds user tabs
import Support from "./components/views/Support"; // holds user tabs
import Personality from "./components/views/Personality";
import { useDispatch } from 'react-redux';
import { getDevice } from './redux/slices/userSlice';


import { setTabScreen } from './redux/slices/interfaceSlice';


import { setScreenAnalytics } from './database';


// SENTRY INIT
if (Platform.OS == 'web') {
  Sentry.Browser.wrap(App)
}
else {
  Sentry.Native.wrap(App);
}
Sentry.init({
  dsn: sentryKey,
  enableInExpoDevelopment: true,
  release: 'dog-watch@v0.01',
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});


export function AppContent() {
  const dispatch = useDispatch();
  var status = useSelector((state) => state.user.status);

  dispatch(getDevice(Platform.OS));

  return (
    <NativeBaseProvider>
      {status == "loading" && (
        <Center flex={1} px="3">
          <Spinner color="indigo.500" />
        </Center>
      )}

      {status == "new" && (
        <NavigationContainer theme={MyTheme}  >
          <Stack.Navigator initialRouteName="Landing" screenListeners={{
            state: (e) => {
              // Do something with the state
              let screen = e.data.state
              let currentScreen = screen.routes[screen.index].name
              setScreenAnalytics(currentScreen);
              dispatch(setTabScreen(currentScreen))
            }
          }}>
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
            <Stack.Screen
              name="Guest Explore"
              component={ExploreScreen}
              options={{
                headerShown: true,
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
              name="Support"
              component={Support}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Personality"
              component={Personality}
              options={{
                headerShown: false,
                gestureEnabled: false
              }}
            />


          </Stack.Navigator>
        </NavigationContainer>
      )}
    </NativeBaseProvider>
  );
}

export default function App() {

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
