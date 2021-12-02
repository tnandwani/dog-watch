import React from 'react';
import firebase from 'firebase';
import DogCard from './components/DogCard'


// UI 
import {
    Box,
    Button,
    Center,

} from "native-base"


export default function ProfileTab() {
    return (
        <Box>

            <Button m="5" colorScheme="indigo" variant="outline" _text={{ color: '#6365F1' }}  > + Add Dog </Button>
            <DogCard/>
            <Center mt="5" flex={1} px="3">
                <Button onPress={() => firebase.auth().signOut()}>Sign Out </Button>
            </Center>

        </Box>

    )
}
