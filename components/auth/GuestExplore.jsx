import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons"

// maps
import IMap from '../views/imap'
import { mapQuestKey } from "../../constants";

// expo location
import Constants from 'expo-constants';
import * as Location from 'expo-location';


import { View, Platform } from "react-native";
import { getHomies, updateFireLocation } from "../../database";
import DogCard from '../widgets/DogCard'

import { Box, Button, Center, FlatList, Spinner } from "native-base";
import { updateLocation } from "../../redux/slices/userSlice";

export default function GuestExplore({ navigation }) {

  let user = useSelector((state) => state.user);
  let dogTags = useSelector((state) => state.explore.dogTags);
  let loading = useSelector((state) => state.explore.loading);
  const [locationStatus, setLocationStatus] = useState('');

  const dispatch = useDispatch();
  useEffect(() => {
    //

    if (user.zone != "Unverified") {
      getHomies(user.latitude, user.longitude);
    }
    else {
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

  if (Platform.OS === "web") {
    return (
      <Center flex={1} px="3">
        Not Available on Web
      </Center>
    );
  }
  return (
    <View style={{ flex: 1 }}>

      {(user.zone !== 'Unverified') &&

        <IMap minLong={user.longitude - 0.03} minLat={user.latitude - 0.08} maxLong={user.longitude + 0.03} maxLat={user.latitude } />

      }
      {(user.zone === 'Unverified') &&
        <IMap minLong={-115.28719067573549} minLat={0.12038549863730057} maxLong={-82.32820630073549} maxLat={55.2976194318208}/>
      }
      {(user.zone === 'Unverified') &&
      // join button for unverfied 
        <Box position='absolute' w='100%' top='10'>
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
          h="50%"
          padding='2'
          bottom='-5'
          rounded="lg"
          shadow={7}
          overflow="hidden"
          borderColor="coolGray.200"
          _dark={{
            borderColor: "coolGray.600",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
          _web={{
            shadow: 7,
            borderWidth: 0,
          }}
          _light={{
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          {(dogTags.length > 0) &&
            <FlatList data={dogTags} renderItem={(dog) => (
              <Box my='1' shadow={3}>
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

      }
    </View>
  );
}
