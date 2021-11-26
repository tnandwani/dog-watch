import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { saveDogSettings } from '../../../redux/slices/dogSlice'


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

export default function Step2({ navigation }) {

    const [accuracy, setAccuracy] = useState();
    const [visibility, setVisibility] = useState();
    const [location, setLocation] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const [locationStatus, setLocationStatus] = useState(<Text> No Location Found</Text>);

    const dispatch = useDispatch()

    // save data to redux
    const saveStep = () => {
        dispatch(saveDogSettings({ accuracy, visibility, location }))
        navigation.navigate("Create")
    }

    const getLocation = () => {
        console.log("getting location");

        (async () => {
            setLocationStatus(<Spinner color="indigo.500" />);
            if (Platform.OS === 'android' && !Constants.isDevice) {
                setErrorMessage('Oops, this will not work on Snack in an Android emulator. Try it on your device!');
                return;
            }
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMessage('Permission to access location was denied');
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            console.log(currentLocation);
            setLocation(currentLocation.coords);
            setLocationStatus(<Text> Location Received</Text>)

        })();
    }



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
                        onValueChange={(value) => setAccuracy(value)}
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
                        onValueChange={(value) => setVisibility(value)}
                    >
                        <Select.Item label="Public" value="Public" />
                        <Select.Item label="Verified Members" value="Members" />
                        <Select.Item label="Friends" value="Friends" />
                    </Select>
                </FormControl>
                <Button mt="2" colorScheme="green" onPress={() => getLocation()}>
                    Allow Location
                </Button>

                {locationStatus}
                <Button.Group
                    mx={{
                        base: "auto",
                        md: 0,
                    }}
                >
                    <Button mt="2" variant="outline" colorScheme="indigo" onPress={() => navigation.goBack()}>
                        Back
                    </Button>
                    <Button mt="2" colorScheme="indigo" _text={{ color: 'white' }} onPress={() => saveStep()}>
                        Next Step
                    </Button>

                </Button.Group>

            </VStack>
        </Box>
    )
}
