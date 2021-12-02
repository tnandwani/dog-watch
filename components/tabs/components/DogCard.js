import React, {useState} from 'react'


import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import {
    Box,
    Heading,
    AspectRatio,
    Image,
    Text,
    Center,
    Stack,
    HStack
} from 'native-base';


export default function DogCard() {
    return (
        <HStack mt="3">
                <Center flex={1} px="3">
                    <Box
                        w="95vw"
                        rounded="lg"
                        overflow="hidden"
                        borderColor="coolGray.200"
                        borderWidth="1"
                        _dark={{
                            borderColor: "coolGray.600",
                            backgroundColor: "gray.700",
                        }}
                        _web={{
                            shadow: 2,
                            borderWidth: 0,
                        }}
                        _light={{
                            backgroundColor: "gray.50",
                        }}
                    >
                        <HStack>
                            <Center w='25vw'>
                                <AspectRatio w="100%" ratio={9 / 9}>
                                    <Image
                                        source={{
                                            uri: "https://www.akc.org/wp-content/uploads/2016/06/German-Shepherd-Dog-laying-down-in-the-backyard-500x487.jpeg",
                                        }}
                                        alt="image"
                                    />
                                </AspectRatio>
                            </Center>
                            <Box w='60vw'>
                                <Stack p="4" space={3}>
                                    <Heading size="md" ml="-1">
                                        Dog Name
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
                                        Breed
                                    </Text>

                                    <Text fontWeight="400" my='-1'>
                                        Location
                                    </Text>
                                    <Text
                                        color="coolGray.600"
                                        _dark={{
                                            color: "warmGray.200",
                                        }}
                                        fontWeight="300"
                                    >
                                        6 Years Old
                                    </Text>

                                </Stack>
                            </Box>

                            <Box w="5vw">
                                
                            </Box>
                        </HStack>


                    </Box>

                </Center>

            </HStack>


    )
}
