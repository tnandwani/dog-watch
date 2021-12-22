import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// maps
import MapView, { PROVIDER_GOOGLE, Circle } from "react-native-maps";
import { Marker } from "react-native-maps";

import { StyleSheet, View, Dimensions, Platform } from "react-native";
import { getHomies } from "../../database";
import { mapStyling } from "../../constants";
import DogCard from '../widgets/DogCard'

import { Box, Button, Center, FlatList, Heading, Spinner } from "native-base";

export default function ExploreTab() {

  let user = useSelector((state) => state.user);
  let dogTags = useSelector((state) => state.explore.dogTags);
  let loading = useSelector((state) => state.explore.loading);

  useEffect(() => {
    //
    getHomies(user.latitude, user.longitude);
  }, []);


  const getLocation = () => {
    console.log("getting location");

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
      var currentAddress = "Unverified";

      // If not mobile get address
      if (Platform.OS !== 'web') {
        // get address
        let reveresResult = await Location.reverseGeocodeAsync(currentPin.coords, false)
        currentAddress = reveresResult[0];
        // get zipcode

        // pass zipcode instead of full addess


      }
      else {
        console.log("Web Mode")
        // get API key for web created accounts - too expensive for only web
        // Location.setGoogleApiKey(googleAPI)
        // let reveresResult = await Location.reverseGeocodeAsync(currentPin.coords, false)
        // currentAddress = reveresResult[0];
      }


      // create new location object 
      let userLocation = {
        coords: currentPin.coords,
        zone: currentAddress.postalCode,

      }
      console.log(userLocation);

      // save state and update UI
      setLocation(userLocation);
      setLocationStatus("Location Received")
      dispatch(saveLocation(userLocation));



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
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyling}
        initialRegion={{
          latitude: user.latitude - 0.03,
          longitude: user.longitude,
          longitudeDelta: 0.1,
          latitudeDelta: 0.1,
        }}
      >

        <Circle center={{
          latitude: 34.02884586515826,
          longitude: -118.41578010808219,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
          radius={1610}
          strokeWidth={0}
          fillColor='rgba(99,102,241, 0.6)'
        />
      </MapView>

      {(!user.latitude) &&
        <Button
          mx='4'
          position='absolute'
          w='95%'
          h='7%'
          top='10'
          colorScheme="indigo"
          _text={{ color: "white" }}
          shadow="7"
          onPress={getLocation}
        >
          Join The Watch
        </Button>
      }



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
              <DogCard dog={dog} />
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
            <Heading> No Dogs Here</Heading>
          </Center>
        }

      </Box>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});