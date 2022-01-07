import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Image } from "react-native";

import {
  Box,
  Heading,
  AspectRatio,
  Text,
  Button,
  Center,
  Stack,
  HStack,
  Avatar,
  Pressable
} from "native-base";

export default function DogView() {
  useEffect(() => { }, []);
  let dog = useSelector((state) => state.explore.dogView);


  return (
    <Center w="100%" mb="2">
      <HStack w="100%">
        <Box w="70%">
          <Stack p="4" ml="3" space={3}>
            <Heading size="md" ml="-1">
              {props.id}
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
              mb='2'
            >
              July 4th - 6pm
            </Text>


          </Stack>
        </Box>
        <Box w="30%">

      

          <HStack space={2} position='absolute' my='1' bottom='1'>
            <Button colorScheme="indigo" size='sm' px='2'> View</Button>
            <Button colorScheme="indigo" size='sm' > Join</Button>


          </HStack>


        </Box>
      </HStack>
    </Center>
  );
}
