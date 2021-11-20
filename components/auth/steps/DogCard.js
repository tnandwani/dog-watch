import React, { Component } from 'react';

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

class DogCard extends Component {
    render() {
        return (
            <Center mt="5">
            <Box
                w="60vw"
                maxW="500"
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
                <Box>
                    <AspectRatio w="100%" ratio={9 / 9}>
                        <Image
                            source={{
                                uri: "https://www.akc.org/wp-content/uploads/2016/06/German-Shepherd-Dog-laying-down-in-the-backyard-500x487.jpeg",
                            }}
                            alt="image"
                        />
                    </AspectRatio>
                </Box>
                <Stack p="4" space={3}>
                    <Stack space={2}>
                        <Heading size="md" ml="-1">
                            {this.state.dogName}
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
                                {this.state.breed}
                            </Text>
                    </Stack>
                    <Text fontWeight="400" my='-1'>
                        Location
                    </Text>
                    <HStack alignItems="center" space={2} justifyContent="space-between">

                        <Text
                            color="coolGray.600"
                            _dark={{
                                color: "warmGray.200",
                            }}
                            fontWeight="300"
                        >
                            6 Years Old
                        </Text>
                    </HStack>
                </Stack>
            </Box>

        </Center>

        );
    }
}

export default DogCard;
