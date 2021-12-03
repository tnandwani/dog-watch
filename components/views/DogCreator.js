import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import * as ImagePicker from 'expo-image-picker';
import { saveDogDetails } from '../../redux/slices/dogSlice'
import { Platform } from 'react-native';

import DogCard from '../tabs/components/DogCard';

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
    Container
} from 'native-base';

export default function DogCreator({ navigation }) {

    // local state
    const [dogName, setDogName] = useState();
    const [breed, setBreed] = useState();
    const [age, setAge] = useState();
    const [gender, setGender] = useState();
    const [profileImage, setProfileImage] = useState(null);

    const dispatch = useDispatch()

    // save data to redux
    const saveStep = () => {
        dispatch(saveDogDetails({ dogName, breed, age, gender, profileImage }))
        navigation.navigate("Settings")
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
            setProfileImage(result.uri);
        }
    };

    return (
        <Container safeArea flex={1} p="2" w="90%" mx="auto" py="8">
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
                    <Input placeholder='Dog Name' onChangeText={(value) => setDogName(value)} />
                </FormControl>
                <FormControl>
                    <FormControl.Label
                        _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                        Breed
                    </FormControl.Label>
                    <Select
                        selectedValue={breed}
                        minWidth="200"
                        accessibilityLabel="Choose Breed"
                        placeholder="Choose Breed"
                        _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="5" />,
                        }}
                        mt={1}
                        onValueChange={(value) => setBreed(value)}
                    >
                        <Select.Item label="Poodle" value="Poodle" />
                        <Select.Item label="Pitbull" value="Pitbull" />
                        <Select.Item label="Unknown" value="Unknown" />
                        <Select.Item label="Mixed" value="Mixed" />
                        <Select.Item label="German Shepherd" value="German Shepherd" />
                    </Select>
                </FormControl>
                <FormControl>
                    <FormControl.Label
                        _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                        Gender
                    </FormControl.Label>
                    <Select
                        selectedValue={gender}
                        minWidth="200"
                        accessibilityLabel="Choose Gender"
                        placeholder="Choose Gender"
                        _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="5" />,
                        }}
                        mt={1}
                        onValueChange={(value) => setGender(value)}
                    >
                        <Select.Item label="Male" value="M" />
                        <Select.Item label="Female" value="F" />

                    </Select>
                </FormControl>
                <FormControl>
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
                        mt={1}
                        onValueChange={(value) => setAge(value)}
                    >
                        <Select.Item label="1" value="1" />
                        <Select.Item label="2" value="2" />
                        <Select.Item label="3" value="3" />
                        <Select.Item label="4" value="4" />


                    </Select>
                </FormControl>

                <Button colorScheme="indigo" variant="outline"> Upload Image</Button>



            </VStack>

            <Divider thickness="2" my="5" />
            <Center  flex={1} >
            <DogCard />

                <HStack space={2} mt='3'>
                    <Button variant="outline" colorScheme="indigo" onPress={() => navigation.goBack()}>
                        Cancel
                    </Button>
                    <Button colorScheme="indigo" onPress={() => saveStep()}>
                        Create Dog Tag
                    </Button>

                </HStack>
            </Center>


        </Container>
    )
}
