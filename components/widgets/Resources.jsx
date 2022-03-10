import React, {  } from "react";

// UI
import {
    Box,
    Center,
    HStack,
    Pressable,

} from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as WebBrowser from 'expo-web-browser';

export default function Resources(props) {


    return (
        <Box>
            <HStack space={3} justifyContent="center">
                {/* TRAINING */}
                <Pressable w="30%" onPress={() => { WebBrowser.openBrowserAsync('https://www.akc.org/expert-advice/training/basic-training/') }}>
                    <Center bg="amber.400" _text={{ color: "white" }} rounded="md" shadow={3} py='2' >
                        <MaterialCommunityIcons
                            name="dog-service"
                            size={24}
                            color="white"
                        />
                        Training
                    </Center>
                </Pressable>

                {/* HEALTH */}
                <Pressable w="30%" onPress={() => { WebBrowser.openBrowserAsync('https://www.akc.org/expert-advice/health/') }}>
                    <Center bg="danger.400" _text={{ color: "white" }} rounded="md" shadow={3} py='2' >
                        <MaterialCommunityIcons
                            name="stethoscope"
                            size={24}
                            color="white"
                        />
                        Health
                    </Center>
                </Pressable>

                {/* DIET */}
                <Pressable w="30%" onPress={() => { WebBrowser.openBrowserAsync('https://www.akc.org/expert-advice/nutrition/') }}>

                    <Center bg="emerald.400" _text={{ color: "white" }} rounded="md" shadow={3} py='2' >
                        <MaterialCommunityIcons
                            name="food-apple"
                            size={24}
                            color="white"
                        />
                        Diet
                    </Center>
                </Pressable>

            </HStack>
        </Box >
    );
}
