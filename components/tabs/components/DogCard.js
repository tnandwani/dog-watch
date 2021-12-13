import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Image } from 'react-native';



import {
    Box,
    Heading,
    AspectRatio,
    Text,
    Center,
    Stack,
    HStack,
} from 'native-base';


export default function DogCard(props) {

    useEffect(() => {


    }, []);


    return (
        <Center w='100%'>
            <Box
                w="100%"
                rounded="lg"
                overflow="hidden"
                borderColor="coolGray.200"
                borderWidth="1"
                _dark={{
                    borderColor: "coolGray.600",
                    backgroundColor: "gray.700",
                }}
                _web={{
                    shadow: 7,
                    borderWidth: 0,
                }}
                _light={{
                    backgroundColor: "gray.50",
                }}
            >
                <HStack w='100%'>
                    <Center w='30%'>
                        <AspectRatio w="100%" ratio={9 / 9}>
                            <Image
                                source={{
                                    uri: props.dog.item.photo,
                                }}
                                alt="image"
                            />
                        </AspectRatio>
                    </Center>
                    <Box w='80%'>
                        <Stack p="4" space={3}>
                            <Heading size="md" ml="-1">
                                {props.dog.item.dogName}
                            </Heading>
                            <Text
                                fontSize="xs"
                                _light={{
                                    color: "violet.500",
                                }}
                                _dark={{
                                    color: "violet.400",
                                }}
                                fontWeight="500"
                                ml="-0.5"
                                mt="-1"
                            >
                                {props.dog.item.breed}

                            </Text>

                            <Text fontWeight="400" my='-1'>
                                {props.dog.item.zone}

                            </Text>
                            <Text
                                color="coolGray.600"
                                _dark={{
                                    color: "warmGray.200",
                                }}
                                fontWeight="300"
                            >
                                {props.dog.item.age}
                                Years Old
                            </Text>

                        </Stack>
                    </Box>

                    <Box w="5%">

                    </Box>
                </HStack>
            </Box>
        </Center>



    )
}
