import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { Marker } from 'react-native-maps';

import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { Center } from "native-base"
import { getHomies } from '../../database';
import { mapStyling } from '../../constants';



export default function ExploreTab() {

  var zone = useSelector((state) => state.user.zone)
  var dogTags = useSelector((state) => state.explore.dogTags)

  useEffect(() => {
    // 
    getHomies(zone);
  }, []);

  if (Platform.OS === 'web') {
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
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {dogTags.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coords}
            title={marker.id}
            description={marker.id}
          />
        ))}
      </MapView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
