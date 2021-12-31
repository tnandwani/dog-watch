import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
    Heading,
    VStack,
    Center,
    HStack,
    Text,
    FormControl,
    Button,
    Slider,
    Box,
    Divider,
    TextArea,
    Icon,
    Switch,
    Spinner
} from 'native-base';

// ICONS
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { savePersonality } from '../../redux/slices/rawDogSlice';

export default function DogViewer(props) {

    useEffect(() => {


    }, []);

    console.log("props are", props)

    return (

        <Box flex={1} p={3} >

            <VStack space={3}>

                <FormControl>
                    <FormControl.Label
                        _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                        Good with people
                    </FormControl.Label>
                    <Slider
                        value={props.dog.personality.people}
                        colorScheme='indigo'
                        minValue={0}
                        maxValue={100}
                        accessibilityLabel="hello world"
                        step={10}
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
                        value={props.dog.personality.otherDogs}
                        colorScheme='indigo'
                        minValue={0}
                        maxValue={100}
                        accessibilityLabel="hello world"
                        step={10}
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
                        value={props.dog.personality.sharing}
                        colorScheme='indigo'
                        minValue={0}
                        maxValue={100}
                        accessibilityLabel="hello world"
                        step={10}
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
                        value={props.dog.personality.energy}
                        colorScheme='indigo'
                        minValue={0}
                        maxValue={100}
                        accessibilityLabel="hello world"
                        step={10}
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
                        value={props.dog.personality.training}
                        colorScheme='indigo'
                        minValue={0}
                        maxValue={100}
                        accessibilityLabel="hello world"
                        step={10}
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
                    <Switch colorScheme="indigo" size="sm" isChecked={props.dog.personality.sn}/>
                </FormControl>
                <FormControl>
                    <FormControl.Label
                        _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                        Biography
                    </FormControl.Label>
                    <Text>{props.dog.personality.bio}</Text>
                </FormControl>

            </VStack>


        </Box>
    )
}
