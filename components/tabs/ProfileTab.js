import React from 'react';
import firebase from 'firebase';

// UI 
import { Button, Center } from "native-base"


export default function ProfileTab() {
    return (
        <Center flex={1} px="3">
            Welcome Back
            <Button onPress={() => firebase.auth().signOut()}>Sign Out </Button>
        </Center>

    )
}
