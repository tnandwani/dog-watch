import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Image } from "react-native";

import {
  Box,
  Center,
  HStack,
  AspectRatio,
  Stack,
  Heading,
  Text

} from "native-base";

export default function DogView() {
  useEffect(() => { }, []);
  let dog = useSelector((state) => state.explore.dogView);

  if (dog) {
    return (
      <Box flex={1} w='100%' m='3'>

        <HStack w="100%" space={3}>
          <Center w="25%">
            <AspectRatio w="115%" ratio={9 / 9}>
              <Image
                source={{
                  uri: dog.profileImage,
                }}
                alt="image"
              />
            </AspectRatio>
          </Center>
          <Box w='70%'>
            <Stack p="4" space={2}>
              <Heading size="md" ml="-1">

                {dog.dogName}
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

                {dog.breed}
              </Text>

              <Text
                color="coolGray.600"
                _dark={{
                  color: "warmGray.200",
                }}
                fontWeight="300"
              >

                {dog.age + " Years Old"}
              </Text>
            </Stack>
          </Box>
        </HStack>
        <Center>
          Ratings
        </Center>
      </Box>
    );
  }
  else {
    return (
      <Center>
        Please Choose a dog to View
      </Center>
    )
  }
}
