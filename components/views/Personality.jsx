import React, { useState, useEffect } from 'react'
import { Keyboard} from 'react-native';

import { useDispatch, useSelector } from 'react-redux'
import * as Analytics from 'expo-firebase-analytics';

import { startPublish, editPublish, uAnalytics } from '../../database';

import {
    Heading,
    VStack,
    Center,
    HStack,
    FormControl,
    Button,
    Progress,
    Slider,
    Box,
    TextArea,
    Icon,
    Switch} from 'native-base';


// ICONS
import { FontAwesome5 } from '@expo/vector-icons';
import { savePersonality } from '../../redux/slices/rawDogSlice';


export default function Personality({ navigation }) {


    useEffect(() => {
        Analytics.logEvent('create_personality_opened', uAnalytics())
    }, []);

    const dispatch = useDispatch()

    // progress bar  
    const progress = useSelector((state) => state.interface.progress.dog)

    // image as prop
    const profileImage = useSelector((state) => state.rawDog.profileImage)
    const editing = useSelector((state) => state.rawDog.editing)

    // personality local state
    let [people, setPeople] = useState()
    let [otherDogs, setOtherDogs] = useState()
    let [sharing, setSharing] = useState()
    let [energy, setEnergy] = useState()
    let [sn, setSn] = useState(true)
    let [training, setTraining] = useState()
    let [bio, setBio] = useState("")

    let [isFinished, setIsFinished] = useState(true)

    let verify = () => {
        if (people && otherDogs && sharing && energy && training && isFinished) {
            setIsFinished(false)
        }
    }

    verify();

    const onPublish = () => {

        // update personality redux
        dispatch(savePersonality({ people, otherDogs, sharing, energy, sn, training, bio }));

        startPublish(profileImage, navigation)


    }
    const onUpdateDog = () => {

        // update personality redux
        dispatch(savePersonality({ people, otherDogs, sharing, energy, sn, training, bio }));
        editPublish(profileImage, navigation)

    }

    return (
        <Box safeArea flex={1} p="2" w="90%" mx="auto" py="8" maxW='768'>
            <Heading size="lg" color="coolGray.800" fontWeight="600">
                Keep everyone safe! Be honest
            </Heading>
   

            <VStack space={2} mt="3">

                <FormControl >

                    <FormControl.Label
                        _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                        Did we miss anything? Tell us more!
                    </FormControl.Label>
                    <TextArea
                        h={20}
                        placeholder="Tell us more!"
                        onSubmitEditing={() => Keyboard.dismiss()}
                        onChangeText={(v) => { setBio(v); }}
                    />
                </FormControl>
                <FormControl>
                    <FormControl.Label
                        _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                        Good with people
                    </FormControl.Label>
                    <Slider
                        defaultValue={0}
                        colorScheme='indigo'
                        minValue={0}
                        maxValue={100}
                        accessibilityLabel="hello world"
                        step={10}
                        onChangeEnd={(v) => {
                            setPeople(v);
                        }}
                    >
                        <Slider.Track>
                            <Slider.FilledTrack />
                        </Slider.Track>
                        <Slider.Thumb borderWidth="0" bg="transparent">
                            <Icon as={FontAwesome5} name="dog" color="black" size="sm" />
                        </Slider.Thumb>
                    </Slider>

                </FormControl>
                <FormControl>
                    <FormControl.Label
                        _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                        Good with other dogs
                    </FormControl.Label>
                    <Slider
                        defaultValue={0}
                        colorScheme='indigo'
                        minValue={0}
                        maxValue={100}
                        accessibilityLabel="hello world"
                        step={10}
                        onChangeEnd={(v) => {
                            setOtherDogs(v);
                        }}
                    >
                        <Slider.Track>
                            <Slider.FilledTrack />
                        </Slider.Track>

                        <Slider.Thumb borderWidth="0" bg="transparent">
                            <Icon as={FontAwesome5} name="dog" color="black" size="sm" />
                        </Slider.Thumb>
                    </Slider>
                </FormControl>
                <FormControl>
                    <FormControl.Label
                        _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                        Sharing Toys
                    </FormControl.Label>
                    <Slider
                        defaultValue={0}
                        colorScheme='indigo'
                        minValue={0}
                        maxValue={100}
                        accessibilityLabel="hello world"
                        step={10}
                        onChangeEnd={(v) => {
                            setSharing(v);
                        }}
                    >
                        <Slider.Track>
                            <Slider.FilledTrack />
                        </Slider.Track>
                        <Slider.Thumb borderWidth="0" bg="transparent">
                            <Icon as={FontAwesome5} name="dog" color="black" size="sm" />
                        </Slider.Thumb>
                    </Slider>
                </FormControl>
                <FormControl>
                    <FormControl.Label
                        _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                        Energy
                    </FormControl.Label>
                    <Slider
                        defaultValue={0}
                        colorScheme='indigo'
                        minValue={0}
                        maxValue={100}
                        accessibilityLabel="hello world"
                        step={10}
                        onChangeEnd={(v) => {
                            setEnergy(v);
                        }}
                    >
                        <Slider.Track>
                            <Slider.FilledTrack />
                        </Slider.Track>

                        <Slider.Thumb borderWidth="0" bg="transparent">
                            <Icon as={FontAwesome5} name="dog" color="black" size="sm" />
                        </Slider.Thumb>
                    </Slider>
                </FormControl>
                <FormControl>
                    <FormControl.Label
                        _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                        Training
                    </FormControl.Label>
                    <Slider
                        defaultValue={0}
                        colorScheme='indigo'
                        minValue={0}
                        maxValue={100}
                        accessibilityLabel="hello world"
                        step={10}
                        onChangeEnd={(v) => {
                            setTraining(v);
                        }}
                    >
                        <Slider.Track>
                            <Slider.FilledTrack />
                        </Slider.Track>

                        <Slider.Thumb borderWidth="0" bg="transparent">
                            <Icon as={FontAwesome5} name="dog" color="black" size="sm" />
                        </Slider.Thumb>
                    </Slider>
                </FormControl>

                <FormControl>
                    <FormControl.Label
                        _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                        Spay or Neutered?
                    </FormControl.Label>
                    <Switch colorScheme="indigo" size="lg" isChecked={sn} onToggle={(v) => {setSn(v) }} />
                </FormControl>


            </VStack>

            {/* <Divider thickness="4" my='4' /> */}

            {/* <RawDogCard image={profileImage} /> */}

            <Center flex={1} >


                <HStack space={2} mt='1'>
                    <Button variant="outline" colorScheme="indigo" onPress={() => navigation.goBack()}>
                        Back
                    </Button>
                    {!editing &&
                        <Button colorScheme="indigo"
                            isDisabled={isFinished}
                            onPress={() => onPublish()}>
                            Create Dog
                        </Button>
                    }
                    {editing &&
                        <Button colorScheme="indigo"
                            isDisabled={isFinished}
                            onPress={() => onUpdateDog()}
                            >
                            Finish Editing
                        </Button>
                    }

                </HStack>

                <Box w="90%" mt='3'>

                    {(progress != 0) &&
                        <Progress colorScheme="indigo" value={progress} mx="4" mt='2' />
                    }
                </Box>
            </Center>



        </Box>
    )
}
