
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
    Box,
    Heading,
    VStack,
    FormControl,
    Input,
    Button
} from 'native-base';
import { saveDogAccount } from '../../redux/slices/dogSlice'
import { saveUserAccount } from '../../redux/slices/userSlice'


// FIREBASE
import firebase from 'firebase/app'

export default function Step3({ navigation }) {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirm, setConfirm] = useState();
    const [alert, setAlert] = useState('Must be atleast 6 characters.');

    const dispatch = useDispatch()

    // save data to redux
    const finalStep = (user, email, uid) => {


        // user is created with firebase 
        dispatch(saveDogAccount({ email, uid }))
        dispatch(saveUserAccount({ email, uid }))

        // upload photo -> get id 
        

        // save Dog to AWdb with photoID

        // save user to AWdb with duid 
    }

    const onSignUp = () => {

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                // save user cred to redux
                finalStep(user, email, user.uid);

                // push final user to AppWrite db 


            })
            .catch((error) => {
                var errorMessage = error.message;
                setAlert(errorMessage);
            });
    }

    return (
        <div>
            <Box safeArea flex={1} p="2" w="90%" mx="auto" py="8">
            <Heading size="lg" color="coolGray.800" fontWeight="600">
                Lets get started!
            </Heading>
            <Heading mt="1" color="coolGray.600" fontWeight="medium" size="xs">
                We need some basic info...
            </Heading>

                <VStack space={3} mt="5">

                    <FormControl>
                        <FormControl.Label
                            _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                            Email
                        </FormControl.Label>
                        <Input type='email' onChangeText={(value) => setEmail(value)} />
                    </FormControl>

                    <FormControl>
                        <FormControl.Label
                            _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                            Password
                        </FormControl.Label>
                        <Input type="password" onChangeText={(value) => setPassword(value)} />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label
                            _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                            Cofirm Password
                        </FormControl.Label>
                        <Input type="password" onChangeText={(value) => setConfirm(value)} />
                        <FormControl.HelperText>
                            {alert}
                        </FormControl.HelperText>
                    </FormControl>
                    <Button.Group
                        mx={{
                            base: "auto",
                            md: 0,
                        }}
                    >
                        <Button mt="2" variant="outline" colorScheme="indigo" onPress={() => navigation.goBack()}>
                            Back
                        </Button>
                        <Button mt="2" colorScheme="indigo" _text={{ color: 'white' }} onPress={() => onSignUp()}>
                           Finish
                        </Button>

                    </Button.Group>

                </VStack>
            </Box>

        </div>
    )
}
