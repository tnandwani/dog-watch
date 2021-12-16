import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import * as ImagePicker from 'expo-image-picker';

// Location
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

import {
    saveDogName,
    saveDogBreed,
    saveDogAge,
    saveDogGender,
    saveContact,
    saveVisibility,
    saveLocation
} from '../../redux/slices/rawDogSlice'

import RawDogCard from '../widgets/RawDogCard'

import {
    Heading,
    VStack,
    Center,
    HStack,
    FormControl,
    Input,
    Button,
    Select,
    CheckIcon,
    Box,
    Divider,
    Flex,
    Spacer,
    Spinner
} from 'native-base';
import { saveDogPic } from '../../redux/slices/rawDogSlice';

export default function DogCreator({ navigation }) {

    // dog details 
    const [dogName, setDogName] = useState();
    const [breed, setBreed] = useState();
    const [age, setAge] = useState();
    const [gender, setGender] = useState();
    const [profileImage, setProfileImage] = useState("https://freesvg.org/img/Dog-Leash.png");

    // owner
    const [contact, setContact] = useState();
    const uid = useSelector((state) => state.user.uid)

    // location
    const [visibility, setVisibility] = useState();
    const [location, setLocation] = useState();
    const [locationStatus, setLocationStatus] = useState("No Location Found");


    const dispatch = useDispatch()


    const updateName = (n) => {
        setDogName(n);
        dispatch(saveDogName(n));
    }
    const updateBreed = (b) => {
        setBreed(b);
        dispatch(saveDogBreed(b));
    }
    const updateAge = (a) => {
        setAge(a);
        dispatch(saveDogAge(a));
    }
    const updateGender = (g) => {
        setGender(g);
        dispatch(saveDogGender(g));
    }
    const updateContact = (a) => {
        setContact(a);
        dispatch(saveContact(a));
    }
    const updateVisibility = (g) => {
        setVisibility(g);
        dispatch(saveVisibility(g));
    }

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);


    const pickImage = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            // get URI
            const URI = result.uri
            
            setProfileImage(URI);
            dispatch(saveDogPic(URI));

        }
    };

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

            // get coords
            let currentPin = await Location.getCurrentPositionAsync({});
            var currentAddress = "Unverified";


            // If not mobile get address
            if (Platform.OS !== 'web') {
                // get address
                let reveresResult = await Location.reverseGeocodeAsync(currentPin.coords, false)
                currentAddress = reveresResult[0];
                // get zipcode

                // pass zipcode instead of full addess
            }
            else {
                console.log("Web Mode")
                // get API key for web created accounts - too expensive for only web
                // Location.setGoogleApiKey(googleAPI)
                // let reveresResult = await Location.reverseGeocodeAsync(currentPin.coords, false)
                // currentAddress = reveresResult[0];
            }


            // create new location object 
            let userLocation = {
                coords: currentPin.coords,
                zone: currentAddress,

            }
            console.log(userLocation);

            // save state and update UI
            setLocation(userLocation);
            setLocationStatus("Location Received")
            dispatch(saveLocation(userLocation));
            


        })();
    }



    return (
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
                        Dog Name
                    </FormControl.Label>
                    <Input placeholder='Dog Name' onChangeText={(value) => updateName(value)} />
                </FormControl>


                <Flex
                    direction="row"
                    mt="1.5"
                    _text={{
                        color: "coolGray.800",
                    }}
                >
                    <FormControl w='49%' >
                        <FormControl.Label
                            _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                            Breed
                        </FormControl.Label>
                        <Select
                            selectedValue={breed}
                            accessibilityLabel="Choose Breed"
                            placeholder="Choose Breed"
                            _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />,
                            }}
                            onValueChange={(value) => updateBreed(value)}
                        >
                            <Select.Item label="Poodle" value="Poodle" />
                            <Select.Item label="Pitbull" value="Pitbull" />
                            <Select.Item label="Unknown" value="Unknown" />
                            <Select.Item label="Mixed" value="Mixed" />
                            <Select.Item label="German Shepherd" value="German Shepherd" />
                        </Select>
                    </FormControl>
                    <Spacer />
                    <FormControl w='49%'>
                        <FormControl.Label
                            _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                            Gender
                        </FormControl.Label>
                        <Select
                            selectedValue={gender}
                            accessibilityLabel="Choose Gender"
                            placeholder="Choose Gender"
                            _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />,
                            }}
                            onValueChange={(value) => updateGender(value)}
                        >
                            <Select.Item label="Male" value="M" />
                            <Select.Item label="Female" value="F" />

                        </Select>
                    </FormControl>
                </Flex>

                <Flex
                    direction="row"
                    mb="2.5"
                    _text={{
                        color: "coolGray.800",
                    }}
                >
                    <FormControl w='49%'>
                        <FormControl.Label
                            _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                            Age
                        </FormControl.Label>
                        <Select
                            selectedValue={age}
                            minWidth="200"
                            accessibilityLabel="Choose Age"
                            placeholder="Choose Age"
                            _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />,
                            }}
                            onValueChange={(value) => updateAge(value)}
                        >
                            <Select.Item label="1" value="1" />
                            <Select.Item label="2" value="2" />
                            <Select.Item label="3" value="3" />
                            <Select.Item label="4" value="4" />


                        </Select>
                    </FormControl>
                    <Spacer />
                    <FormControl w='49%'>
                        <FormControl.Label
                            _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                            Dog Visibility
                        </FormControl.Label>
                        <Select
                            selectedValue={visibility}
                            minWidth="200"
                            accessibilityLabel="Choose Dog Visibility"
                            placeholder="Choose Visibility"
                            _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />,
                            }}
                            onValueChange={(value) => updateVisibility(value)}
                        >

                            <Select.Item label="Neighborhood" value="n" />
                            <Select.Item label="Private" value="p" />

                        </Select>
                    </FormControl>
                </Flex>
                <FormControl>
                    <FormControl.Label
                        _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                        Emergency Contact
                    </FormControl.Label>
                    <Input type='number ' placeholder='(000) 000 - 0000' onChangeText={(value) => updateContact(value)} />
                    <FormControl.HelperText>
                        only shown if dog is marked lost
                    </FormControl.HelperText>
                </FormControl>

                <FormControl>
                    <Button mt="4" colorScheme="indigo" _text={{ color: 'white' }} shadow="7" onPress={getLocation}  > Mark Home </Button>

                    <FormControl.HelperText>
                        {locationStatus}
                    </FormControl.HelperText>
                </FormControl>


                <Button colorScheme="indigo" variant="outline" onPress={pickImage}> Upload Image</Button>



            </VStack>

            <Divider thickness="4" my='4' />

            <RawDogCard image={profileImage} />

            <Center flex={1} >


                <HStack space={2} mt='3'>
                    <Button variant="outline" colorScheme="indigo" onPress={() => navigation.goBack()}>
                        Cancel
                    </Button>
                    <Button colorScheme="indigo" onPress={() =>navigation.navigate("Personality")
}>
                        Add Personality
                    </Button>

                </HStack>
            </Center>


        </Box>
    )
}
