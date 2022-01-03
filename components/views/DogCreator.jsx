import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import * as ImagePicker from 'expo-image-picker';

import * as Analytics from 'expo-firebase-analytics';

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
    FlatList,
    Flex,
    Spacer,
    Spinner
} from 'native-base';
import { saveDogPic } from '../../redux/slices/rawDogSlice';
import { breedList } from '../../constants';
import { deleteDog } from '../../database';


const breedSelects = breedList.map((breed) =>
    <Select.Item label={breed.name} value={breed.name} />
);

const ageList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
const ageSelects = ageList.map((age) =>
    <Select.Item label={age} value={age} />
);

export default function DogCreator({ navigation }) {

    useEffect(() => {

        Analytics.logEvent('create_dog_opened')

    }, []);

    // dog details 
    const [dogName, setDogName] = useState();
    const [breed, setBreed] = useState();
    const [age, setAge] = useState();
    const [gender, setGender] = useState();
    const [profileImage, setProfileImage] = useState(useSelector((state) => state.user.status));

    // owner
    const [contact, setContact] = useState();
    const uid = useSelector((state) => state.user.uid)
    const duid = useSelector((state) => state.rawDog.duid)

    // location
    const [visibility, setVisibility] = useState();
    const [location, setLocation] = useState();
    const [locationStatus, setLocationStatus] = useState("Location will not be public");


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



    const cancelCreate = () => {
        Analytics.logEvent('create_dog_canceled')
        navigation.goBack()
    }

    const pickImage = async () => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();

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

            // get API key for web created accounts - too expensive for only web
            // Location.setGoogleApiKey(googleAPI)

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
            let userZone = "Unverified"

            // If not mobile get address
            if (Platform.OS !== 'web') {
                // get address
                let reveresResult = await Location.reverseGeocodeAsync(currentPin.coords, false)
                userZone = reveresResult[0].postalCode;

            }
            else {
                console.log("Web Mode")
            }


            // create new location object 
            let userLocation = {
                latitude: currentPin.coords.latitude,
                longitude: currentPin.coords.longitude,
                zone: userZone,

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
                            {breedSelects}

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
                    mt="1.5"
                    _text={{
                        color: "coolGray.800",
                    }}
                >
                    <FormControl w='49%' >
                        <FormControl.Label
                            _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                            Age
                        </FormControl.Label>
                        <Select
                            selectedValue={age}
                            accessibilityLabel="Choose Age"
                            placeholder="Choose Age"
                            _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />,
                            }}
                            onValueChange={(value) => updateAge(value)}
                        >
                            {ageSelects}
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
                            accessibilityLabel="Choose Visibility"
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
                 
                    <Button variant="outline" colorScheme="indigo" onPress={() => deleteDog(duid, uid)}>
                        Cancel
                    </Button>
                    {duid &&
                        <Button variant="outline" colorScheme="red" onPress={() => cancelCreate()}>
                            Delete Dog
                        </Button>
                    }
                    <Button colorScheme="indigo" onPress={() => navigation.navigate("Personality")
                    }>
                        Add Personality
                    </Button>

                </HStack>
            </Center>


        </Box>
    )
}
