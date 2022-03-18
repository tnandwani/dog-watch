import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons, MaterialIcons } from "@expo/vector-icons"

import { mapQuestKey } from "../../constants";

// expo location
import Constants from 'expo-constants';
import * as Location from 'expo-location';

import emptySplash from '../../assets/emptySplash.png';
import joinSplash from '../../assets/joinSplash.png';

import { StyleSheet, Dimensions, Platform, Share } from "react-native";
import { getHomies, updateUserLocation, sendFireError, sendSentryMessage, signAnon, logAnalEvent } from "../../database";
import DogCard from '../widgets/DogCard'

import { Box, Button, Center, FlatList, Spinner, Text, Fab, Image, Icon, Popover, HStack, Badge, Flex, VStack, useToast, Heading, Divider } from "native-base";
import { updateLocation } from "../../redux/slices/userSlice";
import { updateLoading } from "../../redux/slices/exploreSlice";
import { updateShowLostModal } from "../../redux/slices/interfaceSlice";
import LostModal from '../modals/LostModal';
import DogViewModal from '../modals/DogViewModal';
import Gmap from "../views/Gmap";
import Feedback from "../modals/Feedback";


export default function ExploreTab({ navigation }) {

  let user = useSelector((state) => state.user);
  let dogTags = useSelector((state) => state.explore.dogTags);
  let lostDogs = useSelector((state) => state.explore.myZone.lost);

  let loading = useSelector((state) => state.explore.loading);
  const [locationLoading, setLocationLoading] = useState(false);
  let [safeAreaNeeded, setSafeAreaNeeded] = useState(0);
  let [safeAreaNeededX, setSafeAreaNeededX] = useState(2);
  let screenName = useSelector((state) => state.interface.screen);

  let [safeH, setSafeH] = useState('65%');
  // default for mobile

  const toast = useToast()
  const sendInvite = async () => {
    try {
      const result = await Share.share({
        message: 'Dog Watch | A Community for dog owners',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (Platform.OS == "web") {
      setSafeAreaNeeded(6)
      setSafeAreaNeededX(5)
      setSafeH('75%')
      // web height
    }

    // 
    if (user.uid === 'unknown') {
      signAnon();
      dispatch(updateLoading(false));

    }
    else {
      // if zone exists
      if (user.zone != "Unverified") {
        // if no cards loaded 
        if (dogTags.length < 1) {
          getHomies(user.zone);

        }
      }
      // show join neighborood splash
      else {
        dispatch(updateLoading(false));
      }
    }


  }, []);

  const getLocation = () => {

    (async () => {

      setLocationLoading(true);
      if (Platform.OS === 'android' && !Constants.isDevice) {
        sendFireError('Permission to access location was denied', 'Location_Permission_Eror');
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        sendFireError('Permission to access location was denied', 'Location_Permission_Eror');
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
          let zip = addy
          if (addy.includes("-")) {
            zip = addy.substr(0, addy.indexOf('-'));
          }



          // create new location object 
          let userLocation = {
            latitude: currentPin.coords.latitude,
            longitude: currentPin.coords.longitude,
            zone: zip,

          }
          // save state and update UI
          // save state and update UI
          setLocationLoading(false);
          
          if (user.status == 'returning') {
            updateUserLocation(userLocation);
          }
          dispatch(updateLocation(userLocation));
          getHomies(user.zone);

        }).catch((error) => {
          sendFireError(error, "EXPLORETAB.fetch.data");
          alert("Problem getting location - Try again later.")

        });
    })();
  }

  // if still loading

  if (loading === true) {
    return (
      <Center my='3'>
        <Spinner color="indigo" />
      </Center>
    );
  }
  // if ready
  if (loading === false) {

    return (
      <Center>
        {/* modals  */}
        <LostModal />
        <DogViewModal />

        {/* Lost Dogs Fab */}
        {user.zone != 'Unverified' && screenName == 'Explore' &&
          <Fab
            onPress={() => dispatch(updateShowLostModal(true))}
            renderInPortal={false} colorScheme="indigo"
            shadow={2}
            placement="top-right"
            mt='8'
            mr='5'
            size="sm"
            icon={<Icon color="white" as={MaterialIcons} name="lightbulb" size="4" />}
            label={"View Lost Dogs (" + lostDogs.length + ')'} />
        }
        {/* UI */}
        <VStack w='100%' maxW={768} h="100%" >

          {/* MOBILE - SHOW MAP */}
          {Platform.OS !== 'web' && user.zone != 'Unverified' &&
            <Box mt='-5' m='-1' h="35%" bg='indigo.300'>
              <Gmap lat={user.latitude} long={user.longitude} />
            </Box>
          }
          {/* WEB - SHOW WARNING */}

          {/* ALL PLATFORMS */}
          <Box  m='2'>
            {(user.zone === 'Unverified') &&
              <Box safeArea>
                <Popover trigger={triggerProps => {
                  return <Button {...triggerProps} w='100%'
                    mt='2'
                    py='5'
                    colorScheme="indigo"
                    _text={{ color: "white" }}
                    shadow="7"
                  >
                    Join The Watch
                  </Button>;
                }}>
                  <Popover.Content accessibilityLabel="Delete Customerd" mx={2}>
                    <Popover.Arrow/>
                    <Popover.CloseButton />
                    <Popover.Header>Permission Request</Popover.Header>
                    <Popover.Body>
                      We are about to ask for your location. This is so we can verify the correct neighborhood for your pup. This also helps keep our community safe. 
                    </Popover.Body>
                    <Popover.Footer justifyContent="flex-end">
                      <Button.Group space={2}>
                        <Button onPress={getLocation}
                          colorScheme="success"
                          isLoading={locationLoading}
                          _loading={{
                            bg: "success.400",
                            _text: {
                              color: "white"
                            }
                          }} _spinner={{
                            color: "white"
                          }}
                          spinnerPlacement="end"
                          isLoadingText="Requesting"
                        >Sounds Good!</Button>
                      </Button.Group>
                    </Popover.Footer>
                  </Popover.Content>
                </Popover>

                <Center mt='30%'>
                  <Image source={joinSplash} style={{ width: 305, height: 159, opacity: 0.8 }} />
                </Center>
              </Box>
            }
            {(user.zone !== 'Unverified') &&
              <Box safeAreaTop={safeAreaNeeded} safeAreaX={safeAreaNeededX} >
                <Box my='2'>
                  <Heading size="xl" color="coolGray.800" fontWeight="600" bold>
                    Your Zone
                  </Heading>
                  <HStack>
                    <Heading my="1" color="coolGray.600" fontWeight="medium" size="xs">
                      {user.zone}
                    </Heading>
                    {/* <Button colorScheme="indigo" onPress={() => dispatch(updateShowLostModal(true))} mb={2}>{"View Lost Dogs (" + lostDogs.length + ')'}</Button> */}

                  </HStack>

                </Box>

                <Divider my="1" />
                {/* CARDS */}
                {/* if dogs in area */}
                {dogTags.length > 0 &&
                  <FlatList maxH={safeH} data={dogTags} renderItem={(dog) => (
                    <Box my='1'>
                      <DogCard dog={dog} navigation={navigation} />
                    </Box>
                  )
                  }
                    keyExtractor={(dog) => dog.duid}
                  />
                }
                {dogTags.length < 1 &&
                  <Center>
                    <Image source={emptySplash} style={{ width: 305, height: 159, opacity: 0.8 }} />
                  </Center>

                }
                <Button
                  mb={3}
                  px='5'
                  py='3'
                  mt='3'
                  variant="subtle"
                  colorScheme="indigo"
                  onPress={() => sendInvite()}
                  endIcon={<Icon as={Ionicons} name="paper-plane-sharp" size="sm" />}
                >
                  Invite Friends
                </Button>
                {/* <Center>
                  <Text fontWeight='thin' fontSize="xs">© Dog Watch by Hutch Studios</Text>
                </Center> */}


              </Box>
            }

          </Box>

        </VStack>

      </Center>
    )
  }


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
