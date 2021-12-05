import React, { Component } from 'react'
import { NativeBaseProvider, Center, Spinner } from "native-base"
import { Provider } from 'react-redux'
import store from './redux/store'
import { firebaseConfig, MyTheme } from './constants'

// FIREBASE
import firebase from 'firebase/app'
const app = firebase.initializeApp(firebaseConfig);

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





export class App extends Component {

  constructor(props) {
    super()
    this.state = {
      loaded: false,
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }

  render() {
    const { loggedIn, loaded } = this.state;

    if (!loaded) {
      return (
        <NativeBaseProvider>
          <Center flex={1} px="3">
            <Spinner color="indigo.500" />

          </Center>
        </NativeBaseProvider>
      )
    }


    return (

      <Provider store={store}>
        <NativeBaseProvider>
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
          {loggedIn &&
            <NavigationContainer theme={MyTheme} >
              <Stack.Navigator initialRouteName="Main" >
                <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
                <Stack.Screen name="DogCreator" component={DogCreator} options={{ headerShown: false }} />

              </Stack.Navigator>
            </NavigationContainer>
          }

        </NativeBaseProvider>


      </Provider>
    )
  }
}

export default App
