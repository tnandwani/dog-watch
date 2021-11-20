import React, { Component, useState } from 'react'
import {
    Box,
    Select,
    Spinner,
    Text,
    Heading,
    VStack,
    FormControl,
    Button,
    CheckIcon
} from 'native-base';

import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';


export default class Settings extends Component {

    constructor(props) {

        super(props);

        this.state = {
            accuracy: '',
            visibility: '',
            location: null,
            errorMessage: null,
            locationStatus: <Text> No Location Found</Text>
        }
        this.getLocation = this.getLocation.bind(this);


    }

    getLocation() {
        console.log("getting location");
     

        (async () => {
            this.setState({
                locationStatus: <Spinner color="indigo.500"/>
              })

            if (Platform.OS === 'android' && !Constants.isDevice) {
                this.setState({
                    errorMessage:'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
                  })
          
                return;
            }
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                this.setState({
                    errorMessage:'Permission to access location was denied'
                  })
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            console.log(currentLocation);

            this.setState({
                location: currentLocation,
                locationStatus: <Text> Location Received</Text>
              })

        })();

        // let text = 'Waiting..';
        // if (this.state.errorMessage) {
        //     text = errorMsg;
        // } else if (this.state.location) {
        //     text = JSON.stringify(location);
        // }
    }


    render() {
        const { accuracy, visibility, errorMessage } = this.state;

        return (
            <Box safeArea flex={1} p="2" w="90%" mx="auto" py="8">
                <Heading size="lg" color="coolGray.800" fontWeight="600">
                    Welcome
                </Heading>
                <Heading mt="1" color="coolGray.600" fontWeight="medium" size="xs">
                    Sign up to continue!
                </Heading>

                <VStack space={3} mt="5">
                    <FormControl>
                        <FormControl.Label
                            _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                            Neighborhood 
                        </FormControl.Label>
                        <Select
                            selectedValue={accuracy}
                            minWidth="200"
                            accessibilityLabel="Choose Accuracy"
                            placeholder="Choose Range"
                            _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />,
                            }}
                            mt={1}
                            onValueChange={(accuracy) => this.setState({ accuracy })}
                        >
                            <Select.Item label="1 Mile" value="1" />
                            <Select.Item label="3 Miles" value="3" />
                            <Select.Item label="5 Miles" value="5" />
                            <Select.Item label="10 Miles" value="10" />

                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormControl.Label
                            _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                            Privacy
                        </FormControl.Label>
                        <Select
                            selectedValue={visibility}
                            minWidth="200"
                            accessibilityLabel="Choose Visibility"
                            placeholder="Choose Visibility"
                            _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />,
                            }}
                            mt={1}
                            onValueChange={(visibility) => this.setState({ visibility })}
                        >
                            <Select.Item label="Public" value="Public" />
                            <Select.Item label="Verified Members" value="Members" />
                            <Select.Item label="Friends" value="Friends" />
                        </Select>
                    </FormControl>
                    <Button mt="2" colorScheme="green" onPress={() => this.getLocation()}>
                        Allow Location
                    </Button>
                    {this.state.locationStatus}
                    <Button.Group
                        mx={{
                            base: "auto",
                            md: 0,
                        }}
                    >
                        <Button mt="2" variant="outline" colorScheme="indigo" onPress={() => this.props.navigation.goBack()}>
                            Back
                        </Button>
                        <Button mt="2" colorScheme="indigo" _text={{ color: 'white' }} onPress={() => this.props.navigation.navigate('Create')}>
                            Next Step
                        </Button>

                    </Button.Group>

                </VStack>
            </Box>

        )
    }
}
