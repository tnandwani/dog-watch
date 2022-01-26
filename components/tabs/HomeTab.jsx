import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'


import Resources from '../views/Resources'

// UI
import {
  Box,
  Divider,
} from "native-base";



export default function HomeTab() {

  useEffect(() => {

    // on load Home screen 
    // get zone doc

  }, []);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user)
  const myZone = useSelector((state) => state.explore.myZone)

  return (
    <Box m="4" maxW='768'>


      <Resources />
      <Divider thickness="3" my="4" />

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
