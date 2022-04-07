import React, { useState } from 'react'

import DogCard from '../widgets/DogCard'
import { useSelector, useDispatch } from 'react-redux'
// UI 
import {
    Box,
    Button,
    Fab,
    FlatList,
    Heading,
    Icon,
    VStack,

} from "native-base"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { signOutUser } from '../../database';
import { resetRawDog } from '../../redux/slices/rawDogSlice';
import { updateShowFeedback } from '../../redux/slices/interfaceSlice'
import Resources from '../widgets/Resources'
import { changeStatus } from '../../redux/slices/userSlice'

export default function ProfileTab({ navigation }) {

    const dispatch = useDispatch()

    const user = useSelector((state) => state.user)
    const pushToken = useSelector((state) => state.explore.pushToken)
    let screenName = useSelector((state) => state.interface.screen);

    const createDogStart = () => {

        // reset 
        dispatch(resetRawDog())
        navigation.navigate("DogCreator")
    }

    return (
        <Box safeArea flex={1} p="1" py="8" w="90%" mx="auto" maxW='768'>
            {screenName == 'Profile' &&
                <Fab
                    onPress={() => createDogStart()}
                    renderInPortal={false} 
                    colorScheme="indigo"
                    shadow={2}
                    placement="top-right"
                    mt='9'
                    size="sm"
                icon={<Icon color="white" as={MaterialCommunityIcons} name="plus" size="4" />}
                    label={'Create Dog'} />
            }

            {/* add dog card for each  */}

            <Heading size="2xl" mt='5' mb='2'>My Dogs</Heading>
            {(user.dogs.length > 0) &&
                <FlatList data={user.dogs} renderItem={(dog) => (
                    <Box my='2'>
                        <DogCard dog={dog} navigation={navigation} />

                    </Box>
                )
                }
                    keyExtractor={(dog) => dog.duid}
                />
            }

            <VStack space={4} mt= '3'>

                <Resources />
                <Button colorScheme="indigo" variant="outline"onPress={() => signOutUser()} > Sign Out</Button>
                <Button
                    leftIcon={<Icon as={Ionicons} name="paw" size="sm" />}
                    endIcon={<Icon as={Ionicons} name="paw" size="sm" />}
                    colorScheme="indigo"
                    onPress={() => { dispatch(updateShowFeedback(true)) }}
                >
                    Send Feedback
                </Button>
                <Button mt='-2' _text={{ fontStyle: 'italic', fontSize: 'xs', fontWeight: 500 }} colorScheme='indigo' variant={'ghost'} onPress={() => {
                    dispatch(changeStatus('support'))
                }}>
                    Support
                </Button>
            </VStack>

        </Box>
    )
}
