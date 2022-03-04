import React, { useEffect } from 'react'
import { Box, Button, Stack, Icon, Center, Heading, Divider } from "native-base"


export default function Support({ navigation }) {
    useEffect(() => {
    }, []);

    return (

        <Center flex={1} px="3">
            <Heading size="2xl" color="coolGray.800" fontWeight="600" bold>
                Support
            </Heading>
            <Heading mt="1" mb='5' color="coolGray.600" fontWeight="medium" size="xs">
                We're here to help
            </Heading>
         
        </Center >

    )
}
