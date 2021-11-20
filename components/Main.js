import React, { Component } from 'react'

// TABS + ICONS
const Tab = createBottomTabNavigator();
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeTab from './tabs/HomeTab'
import ExploreTab from './tabs/ExploreTab'
import ProfileTab from './tabs/ProfileTab'

export default function Main() {

    return (
        <Tab.Navigator>
                <Tab.Screen name="Home" component={HomeTab} options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="home" color={color} size={size} />
                    )
                }} />
                <Tab.Screen name="Explore" component={ExploreTab} options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="compass" color={color} size={size} />
                    )
                }} />
                <Tab.Screen name="Profile" component={ProfileTab} options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="dog-side" color={color} size={size} />
                    )
                }} />
            </Tab.Navigator>
    )
}
