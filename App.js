import React, { Component } from 'react'
import { NativeBaseProvider, Center, Spinner} from "native-base"
import { Provider } from 'react-redux'
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import {userReducer} from './redux/reducers'
import {firebaseConfig, MyTheme} from './constants'

// FIREBASE
import firebase from 'firebase/app'
const app = firebase.initializeApp(firebaseConfig);

// REDUX
const rootReducer = combineReducers({userReducer});
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  rootReducer, 
composeEnhancer(applyMiddleware(thunk))
);

// NAVIGATION
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator()


// SCREENS
import LandingScreen from './components/auth/Landing'
import LoginScreen from './components/auth/Login'
import RegisterScreen from './components/auth/steps/Step1'
import CreateScreen from './components/auth/steps/Step3'
import SettingScreen from './components/auth/steps/Step2'

import MainScreen from './components/Main'


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
          <Spinner color="indigo.500"/>

          </Center>
        </NativeBaseProvider>
      )
    }

    if (!loggedIn) {
      return (
        <Provider store={store}>

        <NativeBaseProvider>
          <NavigationContainer theme={MyTheme}>
            <Stack.Navigator initialRouteName="Landing">
              <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
              <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
              <Stack.Screen name="Create" component={CreateScreen} options={{ headerShown: false }}/>
              <Stack.Screen name="Settings" component={SettingScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
          </NavigationContainer>
        </NativeBaseProvider>
        </Provider>

      );
    }

    return (

      <Provider store={store}>
        <NativeBaseProvider>

        <NavigationContainer theme={MyTheme} >
          <Stack.Navigator initialRouteName="Main" >
            <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />

          </Stack.Navigator>
        </NavigationContainer>
        </NativeBaseProvider>


      </Provider>
    )
  }
}

export default App
