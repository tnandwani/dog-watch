import React, { useEffect } from 'react'
import { Box, Button, Fab, VStack, Icon, Center, Heading, Text } from "native-base"
import { autoLogin, deleteAccount } from '../../database';
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import * as Linking from 'expo-linking'
import { updateShowFeedback } from '../../redux/slices/interfaceSlice';
import { useSelector, useDispatch } from 'react-redux'

export default function Support() {
    useEffect(() => {
    }, []);

    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)


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
                Support Page            
                </Heading>
            <Heading mt="1" mb='5' color="coolGray.600" fontWeight="medium" size="xs">
                We're here to help!
            </Heading>

            <VStack space={5} mt="5">
                {/* MISSION */}
                <Box>

                    <Text color={'indigo.500'} fontSize="lg" bold>Our Mission</Text>
                    <Text fontWeight={'thin'} lineHeight='xl'>Dog Watch is a community for dog owners.Explore other dogs in your area. You can view some of their traits and see if your dogs would get along. You can also mark your dog as lost and alert other owners in your neighborhood. View quick links to some important resources for your pup.</Text>
                </Box>

                {/* DELETE */}
                {user.uid != 'unknown' &&
                    <Box>
                        <Text color={'indigo.500'} fontSize="lg" bold>Leave Community</Text>

                        <Button colorScheme="red" variant='subtle' mt='2' onPress={()=>{deleteAccount()}}>
                            Delete Account
                        </Button>
                    </Box>

                }


                {/* CONTACT US */}
                <Box>
                    <Text color={'indigo.500'} fontSize="lg" bold>Contact Us</Text>
                    <VStack mt='2' space={3}>

                        <Button colorScheme="dark" variant={'outline'} _text={{ color: 'black' }} onPress={() => {
                            Linking.openURL('mailto:support@dogwatch.app')
                        }}> Email Us
                        </Button>
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
                </Box>
             
            </VStack>

        </Box>


    )
}
