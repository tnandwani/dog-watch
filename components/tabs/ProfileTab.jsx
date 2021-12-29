import React, { useState, useEffect } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DogCard from '../widgets/DogCard'
import { useSelector, useDispatch } from 'react-redux'


// UI 
import {
    Box,
    Button,
    FlatList
} from "native-base"
import { getUserDetails, signOutUser } from '../../database';


export default function ProfileTab({ navigation }) {

    const user = useSelector((state) => state.user)
    const pushToken = useSelector((state) => state.explore.pushToken)


    return (
        <Box m='3'>
            {/* add dog card for each  */}

            {(user.dogs.length > 0) &&
                <FlatList data={user.dogs} renderItem={(dog) => (
                    <Box my='1'>
                        <DogCard dog={dog} />

                    </Box>
                )
                }
                    keyExtractor={(dog) => dog.profileImage}
                />
            }


            <Button mt="5" colorScheme="indigo" variant="outline" onPress={() => navigation.navigate("DogCreator")}> + Add Dog </Button>

            <Button colorScheme="orange" mt='4' _text={{ color: 'white' }} onPress={() => signOutUser()} > Sign Out</Button>

        </Box>
    )
}
