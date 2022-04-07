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
    Popover,
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
import { breedList, mapQuestKey } from '../../constants';
import { convertImage, deleteDog, logAnalEvent, sendFireError, sendSentryMessage, uAnalytics } from '../../database';
import { AndroidAudioContentType } from 'expo-notifications';


const breedSelects = breedList.map((breed) =>
    <Select.Item key={breed.name} label={breed.name} value={breed.name} />
);

const ageList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
const ageSelects = ageList.map((age) =>
    <Select.Item key={age.toString()} label={age.toString()} value={age.toString()} />
);

export default function DogCreator({ navigation }) {

    useEffect(() => {

        Analytics.logEvent('create_dog_opened', uAnalytics())

    }, []);

    // dog details 
    const [dogName, setDogName] = useState(useSelector((state) => state.rawDog.dogName));
    const [breed, setBreed] = useState(useSelector((state) => state.rawDog.breed));
    const [age, setAge] = useState(useSelector((state) => state.rawDog.age));
    const [gender, setGender] = useState(useSelector((state) => state.rawDog.gender));
    const [profileImage, setProfileImage] = useState('https://cdn.pixabay.com/photo/2013/11/28/11/31/dog-220273_960_720.jpg');

    // owner
    // const [contact, setContact] = useState();
    const uid = useSelector((state) => state.user.uid)
    const duid = useSelector((state) => state.rawDog.duid)
    const editing = useSelector((state) => state.rawDog.editing)
    // location
    const [visibility, setVisibility] = useState(useSelector((state) => state.rawDog.visibility));
    const [location, setLocation] = useState();
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationHelper, setLocationHelper] = useState("Visibility based on privacy");

    const dispatch = useDispatch()
    const initialFocusRef = React.useRef(null)

    // redux updaters
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
    const updateVisibility = (g) => {
        setVisibility(g);
        if (g == 'n') {
            setLocationHelper('Dog location will only be accurate in emegencies')
        }
        else {
            setLocationHelper('Dog location will only be shown in case of emergencies')

        }
        dispatch(saveVisibility(g));
    }

    // UI functions
    const cancelCreate = () => {
        Analytics.logEvent('create_dog_canceled', uAnalytics())
        navigation.goBack()
    }
    const pickImage = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [6, 6],
            quality: 1,
        });
        if (!result.cancelled) {
            // get URI

            const URI = result.uri
            console.log("URI IS", result);
            // pass raw uri as prop
            setProfileImage(URI);

            //  prep image for upload
            convertImage(URI)



        }
    };

    const getLocation = () => {

        (async () => {

            // get API key for web created accounts - too expensive for only web
            // Location.setGoogleApiKey(googleAPI)

            setLocationLoading(true);
            if (Platform.OS === 'android' && !Constants.isDevice) {
                sendFireError('Permission to access location was denied', 'Location_Permission_Eror');
                return;
            }
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                sendFireError('Permission to access location was denied', 'Location_Permission_Eror');
                return;
            }

            // get coords
            let currentPin = await Location.getCurrentPositionAsync({});

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    location: {
                        latLng: {
                            lat: currentPin.coords.latitude,
                            lng: currentPin.coords.longitude
                        }
                    },
                    options: {
                        thumbMaps: false
                    },
                    includeNearestIntersection: true,
                    includeRoadMetadata: true
                })

            };
            fetch('https://www.mapquestapi.com/geocoding/v1/reverse?key=' + mapQuestKey, requestOptions)
                .then(response => response.json()).catch((error) => {
                    sendFireError(error, "EXPLORETAB.fetch.response");

                })
                .then(data => {
                    const addy = data.results[0].locations[0].postalCode
                    let zip = addy
                    if (addy.includes("-")) {
                        zip = addy.substr(0, addy.indexOf('-'));
                    }


                    let userLocation = {
                        latitude: currentPin.coords.latitude,
                        longitude: currentPin.coords.longitude,
                        zone: zip,

                    }

                    // save state and update UI
                    setLocation(userLocation);
                    setLocationLoading(false)



                    dispatch(saveLocation(userLocation));

                }).catch((error) => {
                    sendFireError(error, "EXPLORETAB.fetch.data");
                    alert("Problem getting location - Try again later.")
                    ƒ
                });






        })();
    }



    let [isFinished, setIsFinished] = useState(true)

    let verify = () => {
        

        if (dogName !== '' && breed && age && gender && visibility && location && isFinished) {
            setIsFinished(false)
        }



    }
    verify();


    return (
        <Box safeAreaTop flex={1} p="2" w="90%" mx="auto" pt="8" maxW='768'>
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
                    <Input placeholder={dogName} autoFocus={!editing} onChangeText={(value) => updateName(value)} />
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
                                endIcon: <CheckIcon size="5" />,
                            }}
                            onValueChange={(value) => updateVisibility(value)}
                        >
                            <Select.Item label="My Neighborhood" value="n" />
                            <Select.Item label="Only Me" value="e" />

                        </Select>
                    </FormControl>
                </Flex>


                <FormControl>


                    {!location &&
                        <Popover trigger={triggerProps => {
                            return <Button {...triggerProps}
                                mt="4"
                                colorScheme="indigo" _text={{ color: 'white' }}
                                shadow="7"
                            >
                                Verification Needed
                            </Button>;
                        }}>
                            <Popover.Content accessibilityLabel="Delete Customer" mx='2'>
                                <Popover.Arrow />
                                <Popover.CloseButton />
                                <Popover.Header>Permission Request</Popover.Header>
                                <Popover.Body>
                                    We need to access your location so we can verify the correct neighborhood for you and your pup. This helps keep our community safe. If you move you will need to update your dogs location.                             </Popover.Body>
                                <Popover.Footer justifyContent="flex-end">
                                    <Button.Group space={2}>
                                        <Button isLoading={locationLoading}
                                            _loading={{
                                                bg: "success.400",
                                                _text: {
                                                    color: "white"
                                                }
                                            }} _spinner={{
                                                color: "white"
                                            }}
                                            spinnerPlacement="end"
                                            isLoadingText="Requesting"
                                            onPress={getLocation}
                                            colorScheme="success">Sounds Good!</Button>
                                    </Button.Group>
                                </Popover.Footer>
                            </Popover.Content>
                        </Popover>
                    }
                    {location &&
                        <Button
                            mt="4"
                            colorScheme="success" _text={{ color: 'white' }}
                            shadow="7"
                            disabled
                            endIcon={<CheckIcon size="5" />}

                        >
                            Zone Verified
                        </Button>
                    }



                </FormControl>


                <Button colorScheme="indigo" variant="outline" onPress={pickImage}> Upload Image</Button>



            </VStack>

            <Divider thickness="4" my='4' />

            <RawDogCard image={profileImage} />

            <Center flex={1} >


                <HStack space={2} mt='3'>

                    <Button variant="outline" colorScheme="indigo" onPress={() => cancelCreate()}>
                        Cancel
                    </Button>
                    {editing &&
                        <Popover
                            placement="top"
                            initialFocusRef={initialFocusRef}
                            trigger={(triggerProps) => {
                                return (<Button  {...triggerProps} variant="outline" colorScheme="red" >
                                    Delete Dog
                                </Button>
                                )
                            }}
                        >
                            <Popover.Content width="56">
                                <Popover.Arrow />
                                <Popover.CloseButton />
                                {/* @ts-ignore */}
                                <Popover.Header>Are you sure?</Popover.Header>
                                <Popover.Body>Dog will be deleted permanently. You will need to recreate them if needed.</Popover.Body>

                                <Popover.Footer>
                                    <Button.Group>
                                        <Button
                                            onPress={() => deleteDog(duid, uid, navigation)}
                                            variant='outline' colorScheme="red">Confirm</Button>
                                    </Button.Group>
                                </Popover.Footer>
                            </Popover.Content>
                        </Popover>

                    }
                    {editing &&
                        <Button colorScheme="indigo" onPress={() => navigation.navigate("Personality")}>
                            Next
                        </Button>
                    }
                    {!editing &&

                        <Button isDisabled={isFinished} colorScheme="indigo" onPress={() => navigation.navigate("Personality")}>
                            Add Personality
                        </Button>
                    }

                </HStack>


            </Center>


        </Box >
    )
}
