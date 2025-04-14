import React, { useEffect, useState } from "react";
import { StyleSheet, Platform, PermissionsAndroid } from "react-native";
import MapView, { Polyline, Region } from "react-native-maps";
import { View } from "react-native";
import * as Location from "expo-location";

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { coords } = location;

      if (coords) {
        const { latitude, longitude } = coords;
        console.log("Latitude:", latitude, "Longitude:", longitude);

        let response = Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        response.then((data) => {
          console.log("Location data:", data);
        });
      } else {
        setErrorMsg("Unable to retrieve location coordinates");
      }
      setLocation(location);
    }

    getCurrentLocation();
  }, []);
  return (
    <View style={styles.container}>
      {location?.coords && (
        <MapView
          style={styles.map}
          initialRegion={
            location?.coords
              ? {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }
              : undefined
          }
          showsUserLocation={true} // Show the user's location on the map
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
