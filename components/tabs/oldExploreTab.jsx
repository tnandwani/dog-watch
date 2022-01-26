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

import { Box, Button, Center, FlatList, Spinner, Fab, Icon, Badge } from "native-base";
import { updateLocation } from "../../redux/slices/userSlice";
import { updateDogView, updateLoading } from "../../redux/slices/exploreSlice";
import { MaterialIcons } from '@expo/vector-icons';
import { updateShowLostModal } from "../../redux/slices/interfaceSlice";
import LostModal from '../modals/LostModal';
import DogViewModal from '../modals/DogViewModal';


export default function ExploreTab({ navigation }) {

  let screen = useSelector((state) => state.interface.screen);
  let user = useSelector((state) => state.user);
  let dogTags = useSelector((state) => state.explore.dogTags);
  let lostDogs = useSelector((state) => state.explore.myZone.lost);

  let loading = useSelector((state) => state.explore.loading);
  const [locationStatus, setLocationStatus] = useState('');

  let dogView = useSelector((state) => state.explore.dogView);

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

      // get API key for web created accounts - too expensive for only web
      // Location.setGoogleApiKey(googleAPI)

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
      fetch('http://www.mapquestapi.com/geocoding/v1/reverse?key=' + mapQuestKey, requestOptions)
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

  if (Platform.OS === "web") {
    return (

      <Center flex={1}>

        <Badge colorScheme="danger" variant="subtle" >Map Unavailable on Web</Badge>
        <LostModal />

        <DogViewModal />

        {(screen === 'Explore') && (user.zone !== 'Unverified') &&
          <Box>
            <Fab
              borderRadius="full"
              onPress={() => dispatch(updateShowLostModal(true))}
              colorScheme="indigo"
              mt='20'
              placement="top-left"
              icon={
                <Icon
                  color="white"
                  as={<MaterialIcons name="lightbulb" />}
                  size="4"
                />
              }
              label={"View Lost Dogs (" + lostDogs.length + ')'}
            />
          </Box>

        }

        <Box position='absolute' top='10' >
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
        <Box
          position='absolute'
          w="100%"
          padding='2'
          bottom='0'
          rounded="xl"
          shadow={7}
          overflow="hidden"

        >

          {dogView &&
            <FlatList data={[dogView]} renderItem={(dog) => (
              <Box my='1'>
                <DogCard dog={dog} navigation={navigation} />
              </Box>
            )
            }
              keyExtractor={(dog) => dog.duid}
            />
          }
          {(loading === true) &&
            <Center mt='5'>
              <Spinner color="white" />
            </Center>
          }
          {((dogTags < 1) && (loading === false)) &&
            <Center mt='5'>
              <Button
                mb={3}
                px='5'
                py='3'
                variant="subtle"
                colorScheme="indigo"
                endIcon={<Icon as={Ionicons} name="paper-plane-sharp" size="sm" />}
              >
                Invite Friends
              </Button>
            </Center>
          }

        </Box>
      </Center>
    );
  }
  else {
    return (
      // mobile container
      <View style={styles.container}>
        <LostModal />

        <DogViewModal />

        {(screen === 'Explore') && (user.zone !== 'Unverified') &&
          <Box>
            <Fab
              borderRadius="full"
              onPress={() => dispatch(updateShowLostModal(true))}
              colorScheme="indigo"
              mt='20'
              placement="top-left"
              icon={
                <Icon
                  color="white"
                  as={<MaterialIcons name="lightbulb" />}
                  size="4"
                />
              }
              label={"View Lost Dogs (" + lostDogs.length + ')'}
            />
          </Box>

        }
        {(user.zone !== 'Unverified') &&
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            maxZoomLevel={12}
            customMapStyle={mapStyling}
            initialRegion={{
              latitude: user.latitude,
              longitude: user.longitude,
              longitudeDelta: 0.2,
              latitudeDelta: 0.2,
            }}
          >

            {dogTags.map((dog, index) => (
              <Marker
                key={index}
                coordinate={{ latitude: dog.latitude, longitude: dog.longitude }}
                title={dog.dogName}
                key={dog.duid}
                description={dog.breed + '  (' + dog.age + ')'}
                onPress={() => dispatch(updateDogView(dog))}
              />
            ))}

            {/* <Circle center={{
            latitude: user.latitude,
            longitude: user.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
            radius={1610}
            strokeWidth={0}
            fillColor='rgba(99,102,241, 0.6)'
          /> */}
          </MapView>

        }
        {(user.zone === 'Unverified') &&
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            maxZoomLevel={12}
            customMapStyle={mapStyling}
            initialRegion={{
              latitude: 39.8283,
              longitude: -98.5795,
              longitudeDelta: 50.0,
              latitudeDelta: 50.0,
            }}
          />

        }

        {(user.zone === 'Unverified') &&

          <Box position='absolute' w='100%' top='20'

          >
            <Center>
              <Button
                w='95%'
                h='20'
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
            </Center>

          </Box>

        }

        {(user.zone !== 'Unverified') &&


          <Box
            position='absolute'
            w="100%"
            padding='2'
            bottom='10'
            rounded="xl"
            shadow={7}
            overflow="hidden"
          >
            {dogView &&
              <FlatList data={[dogView]} renderItem={(dog) => (
                <Box my='1'>
                  <DogCard dog={dog} navigation={navigation} />
                </Box>
              )
              }
                keyExtractor={(dog) => dog.duid}
              />
            }
            {(loading !== true) &&
              <Center mt='5'>
                <Spinner color="white" />
              </Center>
            }
            {((dogTags < 1) && (loading === false)) &&
              <Center mt='5'>
                <Button
                  px='5'
                  py='3'
                  onPress={() => inviteFriends()}
                  variant="subtle"
                  colorScheme="indigo"
                  endIcon={<Icon as={Ionicons} name="paper-plane-sharp" size="sm" />}
                >
                  Invite Friends
                </Button>
              </Center>
            }
          </Box>
        }
      </View>
    );
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