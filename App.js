import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'


import { NativeBaseProvider, Center, Spinner } from "native-base"
import { Provider } from 'react-redux'
import store from './redux/store'
import { MyTheme } from './constants'

//AW
import {
  Appwrite
} from "appwrite";

import {
  appWriteID
} from './constants.js'

const appwrite = new Appwrite();
appwrite
  .setEndpoint('http://localhost/v1') // Your Appwrite Endpoint
  .setProject(appWriteID) // Your project ID
  ;

// NAVIGATION
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator()

// SCREENS
// MAIN
import MainScreen from './components/Main'
// LANDING
import LandingScreen from './components/auth/Landing'
import LoginScreen from './components/auth/Login'
import CreateScreen from './components/auth/Step3'
//SIGNUP - OLD
import RegisterScreen from './components/auth/steps/Step1'
import SettingScreen from './components/auth/steps/Step2'

// VIEW COMPONENTS
import DogCreator from './components/views/DogCreator' // holds user tabs 



export default function App() {

  return (

    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export function AppContent() {

  let loggedIn = ""
  loggedIn = useSelector((state) => state.user.email)

  const [loaded, setLoaded] = useState(false);


  useEffect(() => {
    (async () => {
      //  APP LOADED
      setLoaded(true)

    })();
  }, []);

  return (

    <NativeBaseProvider>

      {/* LOADING SCREEN */}
      {!loaded &&
        <Center flex={1} px="3">
          <Spinner color="indigo.500" />

        </Center>
      }

      {/* NEW USER */}
      {!loggedIn &&
        <NavigationContainer theme={MyTheme}>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Create" component={CreateScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Settings" component={SettingScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>

      }
      {/* RETURNING USER */}

      {loggedIn &&
        <NavigationContainer theme={MyTheme} >
          <Stack.Navigator initialRouteName="Main" >
            <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
            <Stack.Screen name="DogCreator" component={DogCreator} options={{ headerShown: false }} />

          </Stack.Navigator>
        </NavigationContainer>
      }

    </NativeBaseProvider>
  )

}
