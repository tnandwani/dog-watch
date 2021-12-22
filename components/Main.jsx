import React from 'react'

//ICONS
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// TABS 
const Tab = createBottomTabNavigator();
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeTab from './tabs/HomeTab'
import ExploreTab from './tabs/ExploreTab'
import ProfileTab from './tabs/ProfileTab'
import { setScreenAnalytics } from '../database';

export default function Main() {

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
