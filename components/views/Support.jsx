import React, { useEffect } from 'react'
import { Box, Button, Fab, Stack, Icon, Center, Heading, Divider } from "native-base"
import { autoLogin } from '../../database';
import { Ionicons, MaterialIcons } from "@expo/vector-icons"


export default function Support() {
    useEffect(() => {
    }, []);

    return (

        <Center flex={1} px="3">
            <Fab
                onPress={() => {autoLogin()}}
                renderInPortal={false} colorScheme="indigo"
                shadow={2}
                placement="top-right"
                mt='8'
                mr='5'
                size="sm"
                icon={<Icon color="white" as={MaterialIcons} name="close" size="4" />}
                />
            <Heading size="2xl" color="coolGray.800" fontWeight="600" bold>
                Support
            </Heading>
            <Heading mt="1" mb='5' color="coolGray.600" fontWeight="medium" size="xs">
                We're here to help
            </Heading>
         
        </Center >

    )
}
