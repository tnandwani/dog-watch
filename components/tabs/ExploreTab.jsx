import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons"

// maps
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { Marker } from "react-native-maps";
import { mapQuestKey, mapStyling } from "../../constants";

// expo location
import Constants from 'expo-constants';
import * as Location from 'expo-location';


import { StyleSheet, View, Dimensions, Platform } from "react-native";
import { getHomies, updateFireLocation, inviteFriends, sendFireError } from "../../database";
import DogCard from '../widgets/DogCard'

import { Box, Button, Center, FlatList, Spinner, Text, Fab, Icon, Badge, Flex, VStack, useToast } from "native-base";
import { updateLocation } from "../../redux/slices/userSlice";
import { updateDogView, updateLoading } from "../../redux/slices/exploreSlice";
import { MaterialIcons } from '@expo/vector-icons';
import { updateShowLostModal } from "../../redux/slices/interfaceSlice";
import LostModal from '../modals/LostModal';
import DogViewModal from '../modals/DogViewModal';
import Gmap from "../views/Gmap";


export default function ExploreTab({ navigation }) {

  let user = useSelector((state) => state.user);
  let dogTags = useSelector((state) => state.explore.dogTags);
  let lostDogs = useSelector((state) => state.explore.myZone.lost);

  let loading = useSelector((state) => state.explore.loading);
  const [locationStatus, setLocationStatus] = useState('');

  const toast = useToast()

  const sendInvite= ()=> {
    if(Platform.OS === 'web'){

      toast.show({
        description: "Invite copied to Clipboard",
        mb: '3'
      })
    }
    else{
      inviteFriends()
    }

  }
  const dispatch = useDispatch();

  useEffect(() => {

    if (user.zone != "Unverified") {
      getHomies(user.latitude, user.longitude);
    }
    else {
      dispatch(updateLoading(false));
    }
  }, []);


  const getLocation = () => {

    (async () => {

      setLocationStatus(<Spinner color="indigo.500" />);
      if (Platform.OS === 'android' && !Constants.isDevice) {
        setErrorMessage('Oops, this will not work on Snack in an Android emulator. Try it on your device!');
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Permission to access location was denied');
        return;
      }

      // get coords
      let currentPin = await Location.getCurrentPositionAsync({});

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: {
            latLng: {
              lat: currentPin.coords.latitude,
              lng: currentPin.coords.longitude
            }
          },
          options: {
            thumbMaps: false
          },
          includeNearestIntersection: true,
          includeRoadMetadata: true
        })

      };
      fetch('https://www.mapquestapi.com/geocoding/v1/reverse?key=' + mapQuestKey, requestOptions)
        .then(response => response.json())
        .catch((error) => {
          sendFireError(error, "EXPLORETAB.fetch.response");

        }).then(data => {
          const addy = data.results[0].locations[0].postalCode
          const zip = addy.substr(0, addy.indexOf('-'));

          // create new location object 
          let userLocation = {
            latitude: currentPin.coords.latitude,
            longitude: currentPin.coords.longitude,
            zone: zip,

          }
          // save state and update UI
          // save state and update UI
          setLocationStatus("Location Received");
          updateFireLocation(userLocation);
          dispatch(updateLocation(userLocation));
          getHomies(userLocation.latitude, userLocation.longitude);

        }).catch((error) => {
          sendFireError(error, "EXPLORETAB.fetch.data");

        });
    })();
  }

  return (
    <Center>
      {/* modals  */}
      <LostModal />
      <DogViewModal />

      {/* UI */}
      <VStack w='100%' maxW={768} h="100%" >
        {/* MAP */}
        {Platform.OS !== 'web' &&
          <Box mt='-5%' minH="50%" bg='indigo.300'>
            <Gmap lat={user.latitude} long={user.longitude} />
          </Box>
        }
        {/* DRAWER */}
        <Center my='2' bg="red.400" rounded='lg' _text={{
          color: "white",
          fontWeight: "bold"
        }} height="20%" shadow={2}>
          Maps Unavailable on Web
        </Center>

        <Box m='2' >
          {(loading === true) &&
            <Center my='3'>
              <Spinner color="indigo" />
            </Center>
          }
          {(user.zone !== 'Unverified') &&

            <Box>
              <Button colorScheme="indigo" onPress={() => dispatch(updateShowLostModal(true))} mb={2}>{"View Lost Dogs (" + lostDogs.length + ')'}</Button>
              {/* CARDS */}
              <FlatList data={dogTags} renderItem={(dog) => (
                <Box my='1'>
                  <DogCard dog={dog} navigation={navigation} />
                </Box>
              )
              }
                keyExtractor={(dog) => dog.duid}
              />
              <Button
                mb={3}
                px='5'
                py='3'
                mt='2'
                variant="subtle"
                colorScheme="indigo" 
                onPress={() => sendInvite()}
                endIcon={<Icon as={Ionicons} name="paper-plane-sharp" size="sm" />}
              >
                Invite Friends
              </Button>
            </Box>
          }
          {(user.zone === 'Unverified') &&

            <Box>
              <Button
                w='95%'
                mt='2'
                colorScheme="indigo"
                _text={{ color: "white" }}
                shadow="7"
                onPress={getLocation}
              >
                Join The Watch
              </Button>
              <Box mt='3'>
                {locationStatus}

              </Box>
            </Box>
          }
        </Box>

      </VStack>

    </Center>
  )


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3F4",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
