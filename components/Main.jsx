import React, { useState, useEffect, useRef } from 'react';
import {Platform } from "react-native";

import { useSelector, useDispatch } from "react-redux";

//ICONS
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// TABS 
const Tab = createBottomTabNavigator();
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeTab from './tabs/HomeTab'
import ExploreTab from './tabs/ExploreTab'
import ProfileTab from './tabs/ProfileTab'
import { setScreenAnalytics } from '../database';



// NOTIFCATIONS
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { updatePushToken } from '../redux/slices/exploreSlice';

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
        console.log(token);
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

    const dispatch = useDispatch()


    useEffect(() => {

        // If not mobile get address
        if (Platform.OS !== 'web') {
            registerForPushNotificationsAsync().then(token => dispatch(updatePushToken(token)));

            notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
                setNotification(notification);
            });

            responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                console.log(response);
            });

            return () => {
                Notifications.removeNotificationSubscription(notificationListener.current);
                Notifications.removeNotificationSubscription(responseListener.current);
            };

        }
        
    }, []);

    return (
        <Tab.Navigator  screenListeners={{
            state: (e) => {
                // Do something with the state
                let screen = e.data.state
                let currentScreen =  screen.routes[screen.index].name
                setScreenAnalytics(currentScreen);
                
              }
        }}>
            <Tab.Screen name="Profile" component={ProfileTab} options={{
                headerShown: true,
                tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="dog-side" color={color} size={size} />
                )
            }} />
            {/* <Tab.Screen name="Home" component={HomeTab} options={{
                headerShown: true,
                tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="home" color={color} size={size} />
                )
            }} /> */}
            <Tab.Screen name="Explore" component={ExploreTab} options={{
                headerShown: true,
                tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="compass" color={color} size={size} />
                )
            }} />
             
    
        </Tab.Navigator>
    )
}
