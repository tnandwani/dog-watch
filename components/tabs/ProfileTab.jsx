import React, { useState, useEffect } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DogCard from '../widgets/DogCard'
import { useSelector, useDispatch } from 'react-redux'


// UI 
import {
    Box,
    Button,
    FlatList,
    Heading
} from "native-base"
import { getUserDetails, signOutUser } from '../../database';
import { resetRawDog } from '../../redux/slices/rawDogSlice';
import DogViewModal from '../modals/DogViewModal';

export default function ProfileTab({ navigation }) {

    const dispatch = useDispatch()

    const user = useSelector((state) => state.user)
    const pushToken = useSelector((state) => state.explore.pushToken)

    const createDogStart = () => {

        // reset 
        dispatch(resetRawDog())
        navigation.navigate("DogCreator")
    }

    return (
        <Box safeArea flex={1} p="1" py="8" w="90%" mx="auto">
            {/* add dog card for each  */}
            <DogViewModal />

            <Heading size="2xl" mt='5' mb='2'>My Dogs</Heading>
            {(user.dogs.length > 0) &&
                <FlatList data={user.dogs} renderItem={(dog) => (
                    <Box my='2'>
                    <DogCard dog={dog} navigation={navigation} />

                    </Box>
                )
                }
                    keyExtractor={(dog) => dog.profileImage}
                />
            }


            <Button mt="5" colorScheme="indigo" variant="outline" onPress={() => createDogStart()}> + Add Dog </Button>

            <Button colorScheme="orange" mt='4' _text={{ color: 'white' }} onPress={() => signOutUser()} > Sign Out</Button>

        </Box>
    )
}
