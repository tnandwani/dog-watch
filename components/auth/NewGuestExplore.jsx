import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

// maps
import MapView, { PROVIDER_GOOGLE, Circle, Marker } from "react-native-maps";


import Imap from '../views/imap'

// expo location
import Constants from 'expo-constants';
import * as Location from 'expo-location';


import { StyleSheet, View, Dimensions, Platform } from "react-native";
import { getHomies, updateFireLocation } from "../../database";
import { mapStyling } from "../../constants";
import DogCard from '../widgets/DogCard'

import { Box, Button, Center, FlatList, Heading, Spinner, VStack } from "native-base";
import { updateLocation } from "../../redux/slices/userSlice";

export default function GuestExplore() {

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
      setLocationStatus("Location Received");
      updateFireLocation(userLocation);
      dispatch(updateLocation(userLocation));
      getHomies(userLocation.coords.latitude, userLocation.coords.longitude);



    })();
  }


  return (
    <Box>
      <Imap />

    </Box>


  );
}
