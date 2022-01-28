import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { Image } from 'react-native';
import {
    Box,
    Heading,
    AspectRatio,
    Skeleton,
    Text,
    Center,
    Stack,
    HStack,
} from 'native-base';


export default function RawDogCard(props) {
    let dogName = useSelector((state) => state.rawDog.dogName)
    let breed = useSelector((state) => state.rawDog.breed)
    let age = useSelector((state) => state.rawDog.age)
    let zone = useSelector((state) => state.rawDog.zone)

    const [isLoaded, setIsLoaded] = useState(false);



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
                        <Skeleton isLoaded={isLoaded} h={100} >

                            <AspectRatio w="115%" ratio={9 / 9}>
                                <Image

                                    // onLoadStart={() => { console.log("load start"); setIsLoaded(false) }}
                                    onLoadEnd={() => { console.log("pic loaded: default",); setIsLoaded(true) }}
                                    source={{
                                        // uri: props.dog.item.profileImage,
                                        uri: props.image,
                                    }}
                                    alt="image"
                                />


                            </AspectRatio>
                        </Skeleton>
                    
                    </Center>
                    <Box w='60%'>
                        <Stack p="4" space={2}>
                            <Heading size="md" ml="-1">
                                {dogName}
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
                                {breed}
                            </Text>

                            {age && 
                            <Text
                            color="coolGray.600"
                            _dark={{
                                color: "warmGray.200",
                            }}
                            fontWeight="300"
                            >
                                {age + ' Years Old'}
                            </Text>
                            }

                        </Stack>
                    </Box>

                    <Box w="5%">

                    </Box>
                </HStack>
            </Box>
        </Center>



    )
}
