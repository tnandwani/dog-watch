import React from "react";
import { useSelector, useDispatch } from 'react-redux'


import NotificationCard from '../widgets/NotificationCard';
import EventCard from "../widgets/EventCard";

// UI
import {
  Box,
  Button,
  Center,
  VStack,
  Flex,
  Spacer,
  HStack,
  Heading,
  Divider,
  FlatList,
} from "native-base";

import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
export default function HomeTab() {

  const user = useSelector((state) => state.user)

  return (
    <Box m="4">

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
      <Divider thickness="3" my="4" />

      <HStack justifyContent="space-between">
        <Heading>Lost Dogs Nearby</Heading>
        <Button variant="outline" colorScheme="indigo" size="sm">
          Found Dog
        </Button>
      </HStack>
      <VStack w="100%" mt="3">
        {(user.notifications.length > 0) &&
          <FlatList data={user.notifications} renderItem={(noti) => (
            <Box>
              <NotificationCard data={noti.item} />

            </Box>
          )
          }
            keyExtractor={(noti) => noti.identifier}
          />
        }
      </VStack>
      {/*  EVENTS
      <Divider thickness="3" my="2" />

      <HStack justifyContent="space-between">
        <Heading>Nearby Events</Heading>
        <Button variant="outline" colorScheme="indigo" size="sm">
          Host Event
        </Button>
      </HStack>
      <VStack w="100%" mt="3">
        <EventCard id="Joshua Tree" />
        <EventCard id="Venice Beach Hangout" />
        <EventCard id="Billy Birthday bash" />
      </VStack> */}
    </Box>
  );
}
