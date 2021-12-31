import React, { useState, useEffect } from "react";

// UI
import {
    Box,
    Center,
    VStack,
    Flex,
    Spacer,
    Heading,

} from "native-base";


import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Resources(props) {


    return (
        <Box>
            <Heading mb='2'>Resources</Heading>
            <VStack w="100%">
                <Flex
                    direction="row"
                    mb="2.5"
                    mt="1.5"
                    _text={{
                        color: "coolGray.800",
                    }}
                >
                    <Center
                        w="48%"
                        h="20"
                        bg="amber.400"
                        rounded="lg"
                        _text={{ color: "white" }}
                        shadow="5"
                    >
                        <MaterialCommunityIcons
                            name="dog-service"
                            size={24}
                            color="white"
                        />
                        Training
                    </Center>
                    <Spacer />

                    <Center
                        w="48%"
                        h="20"
                        bg="danger.400"
                        rounded="lg"
                        _text={{ color: "white" }}
                        shadow="5"
                    >
                        <MaterialCommunityIcons
                            name="stethoscope"
                            size={24}
                            color="white"
                        />
                        Health
                    </Center>
                </Flex>
                <Flex
                    direction="row"
                    mb="2.5"
                    mt="1.5"
                    _text={{
                        color: "coolGray.800",
                    }}
                >
                    <Center w="48%" h="20" bg="purple.800" rounded="lg" shadow="5">
                        <MaterialCommunityIcons name="food-apple" size={24} color="white" />
                        Diet
                    </Center>
                    <Spacer />

                    <Center w="48%" h="20" bg="tertiary.500" rounded="lg" shadow="5">
                        <MaterialIcons name="park" size={24} color="white" />
                        Parks
                    </Center>
                </Flex>
            </VStack>
        </Box>
    );
}
