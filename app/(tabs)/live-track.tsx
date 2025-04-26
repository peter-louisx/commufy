import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import MapView, {
  LatLng,
  Region,
  Polyline,
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { View } from "react-native";
import { SafeAreaView } from "react-native";
import * as Location from "expo-location";
import { getCurrentLocation } from "@/utils/location";
import { showErrorToast, showSuccessToast } from "@/utils/toast";

export type Route = {
  legs: {
    polyline: { encodedPolyline: string };
    travelMode: string;
    startLocation: {
      latLng: LatLng;
    };
    endLocation: {
      latLng: LatLng;
    };
    stepsOverview: {
      multiModalSegments: {
        stepStartIndex: number;
        stepEndIndex: number;
        travelMode: string;
        navigationInstruction: {
          instructions: string;
        };
      }[];
    };
    steps: {
      polyline: { encodedPolyline: string };
      travelMode: string;
      distanceMeters: number;
      staticDuration: string;
    }[];
  }[];
  distanceMeters: string;
  staticDuration: string;
  polyline: { encodedPolyline: string };
  viewport: {
    low: {
      latitude: number;
      longitude: number;
    };
    high: {
      latitude: number;
      longitude: number;
    };
  };
  travelAdvisory: {
    transitFare: {
      units: string;
    };
  };
  localizedValues: {
    distance: {
      text: string;
    };
    duration: {
      text: string;
    };
    transitFare: {
      text: string;
    };
  };
};

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  const [mapRegion, setMapRegion] = useState<Region | undefined>(undefined);

  useEffect(() => {
    getCurrentLocation()
      .then((resp) => {
        const { location, address } = resp;
        if (location) {
          setLocation(location);
          setMapRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        } else {
          showErrorToast(
            "Location not found. Please enable location services."
          );
        }
      })
      .catch((error) => {
        showErrorToast("Failed to get current location");
      });
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      {/* Map view */}
      <View
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {mapRegion && (
          <MapView
            style={styles.map}
            region={mapRegion}
            showsUserLocation={true}
            showsMyLocationButton={true}
            zoomEnabled={true}
            zoomControlEnabled={true}
            loadingEnabled
            showsPointsOfInterest={false}
            showsBuildings={false}
            showsIndoors={false}
            provider={PROVIDER_GOOGLE}
          ></MapView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flexDirection: "column",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
