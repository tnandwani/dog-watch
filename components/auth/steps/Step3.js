
import React, { Component, useState } from 'react'
import {
    Box,
    Heading,
    VStack,
    FormControl,
    Input,
    Button,
} from 'native-base';

import firebase from 'firebase'

export default class Create extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            number: '',
            alert: 'Must be atleast 6 characters.'
        }

        this.onSignUp = this.onSignUp.bind(this);
    }

    onSignUp() {
        console.log("creating....");
        const { email, password } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((result) => {
                console.log(result);
                firebase.firestore().collection("users")
                    .doc(firebase.auth().currentUser.uid)
                    .set({
                        email
                    })
            }).then(() => {
                this.props.navigation.navigate('Settings')
            })
            .catch((error) => {
                console.log(error)
                this.setState({
                    alert: error.message
                  })
            })

    }

    render() {


        return (
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
                        <Input type='email' onChangeText={(email) => this.setState({ email })} />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label
                            _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                            Phone
                        </FormControl.Label>
                        <Input type="password" onChangeText={(number) => this.setState({ number })} />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label
                            _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                            Password
                        </FormControl.Label>
                        <Input type="password" onChangeText={(password) => this.setState({ password })} />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label
                            _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                            Cofirm Password
                        </FormControl.Label>
                        <Input type="password" />
                        <FormControl.HelperText>
            {this.state.alert}
          </FormControl.HelperText>
                    </FormControl>
                    <Button.Group
                        mx={{
                            base: "auto",
                            md: 0,
                        }}
                    >
                                 <Button mt="2" variant = "outline" colorScheme="indigo" onPress={() => this.props.navigation.goBack()}>
                            Back
                        </Button>
                        <Button mt="2" colorScheme="indigo" _text={{ color: 'white' }} onPress={() => this.onSignUp()}>
                            Next Step
                        </Button>
                 
                    </Button.Group>

                </VStack>
            </Box>

        )
    }
}
