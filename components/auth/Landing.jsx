import React, { useEffect } from 'react'
import { Box, Button, VStack, Icon, Center, Heading, Divider } from "native-base"
import { MaterialIcons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { googleSignIn } from '../../database';
import { Platform } from 'react-native';
import GoogleButton from './socials/GoogleButton'
import AppleButton from './socials/AppleButton'

import * as Linking from 'expo-linking';
import { useDispatch } from 'react-redux';
import { changeStatus } from '../../redux/slices/userSlice';
import { fontStyle } from 'styled-system';


export default function Landing({ navigation }) {
    useEffect(() => {
        
    }, []);
    const dispatch = useDispatch();

    return (

        <Center safeArea flex={1} px="3">
            <Heading size="2xl" color="coolGray.800" fontWeight="600" bold>
                Dog Watch
            </Heading>
            <Heading mt="1" mb='5' color="coolGray.600" fontWeight="medium" size="xs">
                A Community for Dog Owners
            </Heading>
            <VStack
                mt="4"
                space={4}
            >

                <Button
                    colorScheme="emerald"
                    leftIcon={<MaterialIcons name="explore" size={24} color="white" />}
                    onPress={() => navigation.navigate("Guest Explore")}
                >
                    Guest Explore
                </Button>
                <Button
                    colorScheme="muted"
                    leftIcon={<MaterialCommunityIcons name="email-plus" size={24} color="white" />}
                    onPress={() => {
                        navigation.navigate("Create")
                    }
                    }
                >
                    Create Account
                </Button>


                <GoogleButton />

                {Platform.OS == 'ios' &&
                    <AppleButton />
                }
                <Button
                    colorScheme="indigo"
                    leftIcon={<MaterialIcons name="email" size={24} color="white" />}
                    onPress={() => navigation.navigate("Login")}
                >
                    Email Login
                </Button>

                <Box mt ='5'>
                    <Button _text={{ fontStyle: 'italic', fontSize: 'xs', fontWeight: 500 }}colorScheme='indigo' variant={'ghost'} onPress={()=>{
                        dispatch(changeStatus('support'))
                    }}>
                        Support
                    </Button>

                </Box>
            </VStack>
        </Center >

    )
}
