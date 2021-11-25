
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
    Box,
    Heading,
    VStack,
    FormControl,
    Input,
    Button,
} from 'native-base';
import { saveDogAccount } from '../../../redux/slices/userSlice'

// FIREBASE
import firebase from 'firebase/app'

export default function Step3({ navigation }) {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirm, setConfirm] = useState();
    const [number, setNumber] = useState();
    const [alert, setAlert] = useState('Must be atleast 6 characters.');

    const dispatch = useDispatch()

    // save data to redux
    const saveStep = () => {
        dispatch(saveDogAccount({ email, number }))
    }

    const onSignUp = () => {

        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in 
          var user = userCredential.user;
        
          // save user cred to redux
            saveStep();
            
          // push final user to AppWrite db 

          
        })
        .catch((error) => {
          var errorMessage = error.message;
          setAlert(errorMessage);
        });    }

    return (
        <div>
                    <Box safeArea flex={1} p="2" w="90%" mx="auto" py="8">
                <Heading size="lg" color="coolGray.800" fontWeight="600">
                    Owner info
                </Heading>
                <Heading mt="1" color="coolGray.600" fontWeight="medium" size="xs">
                    Few more details just in case...
                </Heading>

                <VStack space={3} mt="5">
                    <FormControl>
                        <FormControl.Label
                            _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                            Email
                        </FormControl.Label>
                        <Input type='email' onChangeText={(value) => setEmail(value)}/>
                    </FormControl>
                    <FormControl>
                        <FormControl.Label
                            _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                            Phone
                        </FormControl.Label>
                        <Input type="number" placeholder = "(XXX) XXX XXXX" onChangeText={(value) => setNumber(value)} />
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
                        <Input type="password" onChangeText={(value) => setConfirm(value)}/>
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
                                 <Button mt="2" variant = "outline" colorScheme="indigo" onPress={() => navigation.goBack()}>
                            Back
                        </Button>
                        <Button mt="2" colorScheme="indigo" _text={{ color: 'white' }} onPress={() => onSignUp()}>
                            Next Step
                        </Button>
                 
                    </Button.Group>

                </VStack>
            </Box>
            
        </div>
    )
}
