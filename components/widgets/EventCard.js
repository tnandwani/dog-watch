import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Image } from "react-native";

import {
  Box,
  Heading,
  AspectRatio,
  Text,
  VStack,
  Center,
  Stack,
  HStack,
  Avatar,
} from "native-base";

export default function EventCard(props) {
  useEffect(() => {}, []);

  return (
    <Center w="100%" mb="2">
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
        <HStack w="100%">
          <Center w="30%">
            <AspectRatio w="110%" ratio={9 / 9}>
              <Image
                source={{
                  uri: "https://www.laparks.org/sites/default/files/facility/sepulveda-basin-leash-dog-park/images/sepulveda-basin-dog-park-34.jpg",
                }}
                alt="image"
              />
            </AspectRatio>
          </Center>
          <Box w="75%">
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
              >
                July 4th - 6pm
              </Text>

              <Box alignItems="flex-start">
                <Avatar.Group size="sm" mr="3" max={3}>
                  <Avatar
                    bg="green.500"
                    source={{
                      uri: "https://pbs.twimg.com/profile_images/1369921787568422915/hoyvrUpc_400x400.jpg",
                    }}
                  >
                    SS
                  </Avatar>
                  <Avatar
                    bg="lightBlue.500"
                    source={{
                      uri: "https://pbs.twimg.com/profile_images/1309797238651060226/18cm6VhQ_400x400.jpg",
                    }}
                  >
                    AK
                  </Avatar>
                  <Avatar
                    bg="indigo.500"
                    source={{
                      uri: "https://pbs.twimg.com/profile_images/1352844693151731713/HKO7cnlW_400x400.jpg",
                    }}
                  >
                    RS
                  </Avatar>
                  <Avatar
                    bg="amber.600"
                    source={{
                      uri: "https://pbs.twimg.com/profile_images/1320985200663293952/lE_Kg6vr_400x400.jpg",
                    }}
                  >
                    MR
                  </Avatar>
                  <Avatar
                    bg="emerald.600"
                    source={{
                      uri: "https://bit.ly/code-beast",
                    }}
                  >
                    CB
                  </Avatar>
                  <Avatar
                    bg="blue.600"
                    source={{
                      uri: "https://pbs.twimg.com/profile_images/1177303899243343872/B0sUJIH0_400x400.jpg",
                    }}
                  >
                    GG
                  </Avatar>
                  <Avatar
                    bg="black.600"
                    source={{
                      uri: "https://pbs.twimg.com/profile_images/1352844693151731713/HKO7cnlW_400x400.jpg",
                    }}
                  >
                    RS
                  </Avatar>
                  <Avatar
                    bg="blueGray.600"
                    source={{
                      uri: "https://pbs.twimg.com/profile_images/1320985200663293952/lE_Kg6vr_400x400.jpg",
                    }}
                  >
                    MR
                  </Avatar>
                </Avatar.Group>
              </Box>
            </Stack>
          </Box>
        </HStack>
      </Box>
    </Center>
  );
}
