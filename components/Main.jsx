import React, { useState, useEffect, useRef } from 'react';
import { Platform } from "react-native";

import { useSelector, useDispatch } from "react-redux";

//ICONS
import { MaterialCommunityIcons } from "@expo/vector-icons"

// TABS 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ExploreTab from './tabs/ExploreTab'
import ProfileTab from './tabs/ProfileTab'
import { addTokenToUser, sendFireError, setScreenAnalytics } from '../database';



// NOTIFCATIONS
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { updatePushToken } from '../redux/slices/exploreSlice';
import { addNotification } from '../redux/slices/userSlice';
import { setTabScreen } from '../redux/slices/interfaceSlice';


const Tab = createBottomTabNavigator();


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
        const {
            status: existingStatus
        } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const {
                status
            } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}



export default function Main() {

    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    let oldToken = useSelector((state) => state.explore.pushToken);

    const dispatch = useDispatch()

    useEffect(() => {

        // If mobile
        if (Platform.OS !== 'web') {
            registerForPushNotificationsAsync().then(token => {
                console.log('got token:', token)
                if (token !== oldToken){
                    addTokenToUser(token);
                }
            }).catch((error) => {
                sendFireError(error.message, "MAIN.registerForPushNotificationsAsync")
            });
            notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
                setNotification(notification);
                dispatch(addNotification(notification))
            });

            responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            });

            return () => {
                Notifications.removeNotificationSubscription(notificationListener.current);
                Notifications.removeNotificationSubscription(responseListener.current);
            };

        }

    }, []);

    return (
  
            <Tab.Navigator screenListeners={{
                state: (e) => {
                    // Do something with the state
                    let screen = e.data.state
                    let currentScreen = screen.routes[screen.index].name
                    setScreenAnalytics(currentScreen);
                    dispatch(setTabScreen(currentScreen))

                }
            }}>

                {/* <Tab.Screen name="Home" component={HomeTab} options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="home" color={color} size={size} />
                )
            }} /> */}
                <Tab.Screen name="Explore" component={ExploreTab} options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="compass" color={color} size={size} />
                    )
                }} />
                <Tab.Screen name="Profile" component={ProfileTab} options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="dog-side" color={color} size={size} />
                    )
                }} />


            </Tab.Navigator>

    )
}
