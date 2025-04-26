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
  const [endLocation, setEndLocation] = useState<LatLng | null>(null);
  const [routeSteps, setRouteSteps] = useState<
    {
      latitude: number;
      longitude: number;
      travelMode: string;
    }[][]
  >([]);
  const [mapRegion, setMapRegion] = useState<Region | undefined>(undefined);

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
          >
            {routeSteps.length > 0 &&
              routeSteps.map((step, index) => (
                <>
                  {step[0].travelMode === "WALK" && (
                    <Polyline
                      key={index + "walk"}
                      coordinates={step.map((point) => ({
                        latitude: point.latitude,
                        longitude: point.longitude,
                      }))}
                      strokeColor={"#4287f5"}
                      lineDashPattern={[10, 5]}
                      geodesic={true}
                      strokeWidth={8}
                    />
                  )}
                  {step[0].travelMode === "TRANSIT" && (
                    <Polyline
                      key={index + "transit"}
                      coordinates={step.map((point) => ({
                        latitude: point.latitude,
                        longitude: point.longitude,
                      }))}
                      strokeColor={"#f54242"}
                      strokeWidth={5}
                    />
                  )}
                </>
              ))}
            {
              // Display the marker for end location
              endLocation && (
                <Marker
                  key="endLocation"
                  coordinate={{
                    latitude: endLocation.latitude,
                    longitude: endLocation.longitude,
                  }}
                />
              )
            }
          </MapView>
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
