import React, { useEffect } from 'react'
import { Box, Button, Fab, VStack, Icon, Center, Heading, Text } from "native-base"
import { autoLogin } from '../../database';
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import * as Linking from 'expo-linking'
import { updateShowFeedback } from '../../redux/slices/interfaceSlice';
import { useSelector, useDispatch } from 'react-redux'

export default function Support() {
    useEffect(() => {
    }, []);

    const dispatch = useDispatch()


    return (
        <Box safeArea flex={1} p="2" w="90%" mx="auto" py="8">
            <Fab
                onPress={() => { autoLogin() }}
                renderInPortal={false} colorScheme="indigo"
                shadow={2}
                placement="top-right"
                mt='8'
                size="sm"
                icon={<Icon color="white" as={MaterialIcons} name="close" size="4" />}
            />
            <Heading size="lg" color="coolGray.800" fontWeight="600">
                Support Page            </Heading>
            <Heading mt="1" mb='5' color="coolGray.600" fontWeight="medium" size="xs">
                We're here to help!
            </Heading>

            <VStack space={1} mt="5">

                <Text color={'indigo.500'} fontSize="lg" bold>Our Mission</Text>
                <Text>The Dog Watch commnuity believes in....</Text>

                <Text color={'indigo.500'} mt='5' fontSize="lg" bold>Contact Us</Text>
                <VStack mt='2' space={2}>

                    <Button colorScheme="dark" variant={'outline'} _text={{ color: 'black' }} onPress={() => {
                        Linking.openURL('mailto:support@dogwatch.app')
                    }}> Email Us </Button>
                    <Button
                        leftIcon={<Icon as={Ionicons} name="paw" size="sm" />}
                        endIcon={<Icon as={Ionicons} name="paw" size="sm" />}
                        colorScheme="indigo"
                        onPress={() => { dispatch(updateShowFeedback(true)) }}
                    >
                        Send Feedback
                    </Button>
                    <Button _text={{ fontStyle: 'italic', fontSize: 'xs', fontWeight: 500 }} colorScheme='indigo' variant={'ghost'} 
                    onPress={() => {
                        Linking.openURL('https://www.freeprivacypolicy.com/live/f4ce1dee-5d21-484d-bc96-db85025e8d6f')
                    }}>
                        Privacy Policy
                    </Button>
                </VStack>
            </VStack>

        </Box>


    )
}
