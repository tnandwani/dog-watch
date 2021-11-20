import React from 'react'
import { Text, Button, Stack, Icon, Center, Heading } from "native-base"
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default function Landing({ navigation }) {
    return (

        <Center flex={1} px="3">
       <Heading size="2xl" color="coolGray.800" fontWeight="600" bold>
                    Dog Watch
                </Heading>
                <Heading mt="1" mb = '5' color="coolGray.600" fontWeight="medium" size="xs">
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
                    colorScheme="indigo"
                    leftIcon={<Icon as={MaterialIcons} name="key" size="md" />}
                    onPress={() => navigation.navigate("Login")}
                >
                    Login
                </Button>
                <Button
                    colorScheme="orange"
                    leftIcon={<Icon as={MaterialIcons} name="account-plus" size="md" />}
                    onPress={() => navigation.navigate("Register")}
                >
                    Register
                </Button>
                <Button
                    colorScheme="teal"
                    leftIcon={<Icon as={MaterialIcons} name="compass" size="md" />}
                    onPress={() => navigation.navigate("Register")}
                >
                    Explore
                </Button>
            </Stack>
        </Center>

    )
}
