import React, { useEffect } from 'react'
import { Box, Button, Stack, Icon, Center, Heading, Divider } from "native-base"
import { MaterialIcons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { googleSignIn } from '../../database';
import { Platform } from 'react-native';

export default function Landing({ navigation }) {
    useEffect(() => {
    }, []);

    return (

        <Center flex={1} px="3">
            <Heading size="2xl" color="coolGray.800" fontWeight="600" bold>
                Dog Watch
            </Heading>
            <Heading mt="1" mb='5' color="coolGray.600" fontWeight="medium" size="xs">
                A Community for Dog Owners
            </Heading>
            <Stack
                mt="4"
                direction={{
                    base: "column",
                    md: "row",
                }}
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
                    onPress={() => navigation.navigate("Create")}
                >
                    Create Account
                </Button>



                {Platform.OS == 'web' &&
                    <Button
                        colorScheme="red"
                        leftIcon={<AntDesign name="google" size={24} color="white" />}
                        onPress={() => googleSignIn()}
                    >
                        Google Login
                    </Button>
                }
                {/* <Button
                    bgColor="black"
                    leftIcon={<AntDesign name="apple1" size={24} color="white" />}
                    onPress={() => navigation.navigate("Login")}
                >
                    Apple Login
                </Button> */}


                <Button
                    colorScheme="indigo"
                    leftIcon={<MaterialIcons name="email" size={24} color="white" />}
                    onPress={() => navigation.navigate("Login")}
                >
                    Email Login
                </Button>
            </Stack>
        </Center >

    )
}
