// REACT
import React from 'react';
import { Platform } from 'react-native';

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
import ExploreScreen from "./components/auth/GuestExplore";

// TAB HOLDER
import MainScreen from "./components/Main";
// VIEW COMPONENTS
import DogCreator from "./components/views/DogCreator"; // holds user tabs
import Personality from "./components/views/Personality";
import { useDispatch } from 'react-redux';
import { getDevice } from './redux/slices/userSlice';
import { setScreenAnalytics } from './database';
import { setTabScreen } from './redux/slices/interfaceSlice';

//Crashalytics
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: sentryKey,
  enableInExpoDevelopment: true,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});
// Access any @sentry/react-native exports via:

console.log("Sentry NAME", )


export function App() {

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

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
        <NavigationContainer theme={MyTheme} >
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
              name="GuestExplore"
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


export default Sentry.Native.wrap(App);
