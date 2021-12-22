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

export default function EventCard(props) {
  useEffect(() => { }, []);

  const sayHi = () =>{
    console.log('hi')
  }
  return (
    <Center w="100%" mb="2">
      <Box
        w="100%"
        rounded="lg"
        overflow="hidden"
        borderColor="coolGray.200"
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
      
            <Box alignItems="flex-start" my='3'>
              <Avatar.Group size="sm" mr="1" max={3}>
                <Avatar
                  bg="green.500"
                  key='1'
                  source={{
                    uri: "https://pbs.twimg.com/profile_images/1369921787568422915/hoyvrUpc_400x400.jpg",
                  }}
                >
                  SS
                </Avatar>
                <Avatar
                  bg="lightBlue.500"
                  key='2'
                  source={{
                    uri: "https://pbs.twimg.com/profile_images/1309797238651060226/18cm6VhQ_400x400.jpg",
                  }}
                >
                  AK
                </Avatar>
                <Avatar
                  bg="indigo.500"
                  key='3'
                  source={{
                    uri: "https://pbs.twimg.com/profile_images/1352844693151731713/HKO7cnlW_400x400.jpg",
                  }}
                >
                  RS
                </Avatar>
                <Avatar
                  key='4'
                  bg="amber.600"
                  source={{
                    uri: "https://pbs.twimg.com/profile_images/1320985200663293952/lE_Kg6vr_400x400.jpg",
                  }}
                >
                  MR
                </Avatar>
                <Avatar
                  key='5'
                  bg="emerald.600"
                  source={{
                    uri: "https://bit.ly/code-beast",
                  }}
                >
                  CB
                </Avatar>
                <Avatar
                  key='6'
                  bg="blue.600"
                  source={{
                    uri: "https://pbs.twimg.com/profile_images/1177303899243343872/B0sUJIH0_400x400.jpg",
                  }}
                >
                  GG
                </Avatar>
                <Avatar
                  key='7'
                  bg="black.600"
                  source={{
                    uri: "https://pbs.twimg.com/profile_images/1352844693151731713/HKO7cnlW_400x400.jpg",
                  }}
                >
                  RS
                </Avatar>
                <Avatar
                  key='8'
                  bg="blueGray.600"
                  source={{
                    uri: "https://pbs.twimg.com/profile_images/1320985200663293952/lE_Kg6vr_400x400.jpg",
                  }}
                >
                  MR
                </Avatar>
              </Avatar.Group>
            </Box>

            <HStack space={2} position ='absolute' my = '1' bottom = '1'>
              <Button  colorScheme="indigo" size='sm' px= '2'> View</Button>
              <Button colorScheme="indigo" size='sm' > Join</Button>


            </HStack>

           
          </Box>
        </HStack>
      </Box>
    </Center>
  );
}
