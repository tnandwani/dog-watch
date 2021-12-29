import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Image } from "react-native";
import { Linking, Alert, Platform } from 'react-native';

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
import { markFound } from "../../database";

export default function NotificationCard(props) {

  let notiData = props.data.request.content.data;

  useEffect(() => { }, []);

  const callNumber = phone => {
    console.log('callNumber ----> ', phone);
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
      phoneNumber = `telprompt:${phone}`;
    }
    else {
      phoneNumber = `tel:${phone}`;
    }
    Linking.canOpenURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(err => console.log(err));
  };

  
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
        <HStack w='100%'>
          <Center w='35%'>
            <AspectRatio w="115%" ratio={9 / 9}>
              <Image
                source={{ uri: notiData.dog.profileImage }}
              />
            </AspectRatio>
          </Center>
          <Box w='65%'>
            <Stack p="4" space={1} ml='3'>
              <Heading size="md" ml="-1">
                {notiData.dog.dogName}
              </Heading>
              <Text
                color="coolGray.600"
                _dark={{
                  color: "warmGray.200",
                }}
                fontWeight="300"
              >
                {notiData.message}
              </Text>
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
                mt="1"
              >
                {notiData.date}
              </Text>
        
              <HStack space={2} mt='3' alignContent='flex-end'>
                <Button colorScheme="indigo" size='sm' px='5'> View</Button>
                <Button colorScheme="indigo" size='sm' px='5' onPress={() => callNumber(notiData.EContact)}> Contact</Button>
              </HStack>
            </Stack>
          </Box>
        

        </HStack>
      </Box>
    </Center>
  );
}
