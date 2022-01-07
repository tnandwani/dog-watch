import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'


import NotificationCard from '../widgets/NotificationCard';
import EventCard from "../widgets/EventCard";
import Resources from '../views/Resources'

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
import { getZoneData } from "../../database";
import DogViewModal from "../modals/DogViewModal";


export default function HomeTab() {

  useEffect(() => {

    // on load Home screen 
    // get zone doc
    getZoneData();

  }, []);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user)
  const myZone = useSelector((state) => state.explore.myZone)

  return (
    <Box m="4">


      <Resources />
      <Divider thickness="3" my="4" />


      <Heading>Lost Dogs Nearby</Heading>

      <VStack w="100%" mt="3">
        {(myZone.lost.length > 0) &&
          <FlatList data={myZone.lost} renderItem={(noti) => (
            <Box>
              <NotificationCard data={noti.item} />

            </Box>
          )
          }
            keyExtractor={(noti) => noti.dog.duid}
          />
        }
      </VStack>
       
      {/* <Divider thickness="3" my="2" />

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
