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
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import polyline from "@mapbox/polyline";
import { GoogleAPI } from "@/api/google";
import { getCurrentLocation } from "@/utils/location";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import { FontAwesome5 } from "@expo/vector-icons";
import { useGlobalSearchParams } from "expo-router";

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
  const params = useGlobalSearchParams();

  const getRegionPositionAfterRoute = (
    routeSteps: { latitude: number; longitude: number }[][]
  ): Region => {
    const allPoints = routeSteps.flat();
    const minLat = Math.min(...allPoints.map((p) => p.latitude));
    const maxLat = Math.max(...allPoints.map((p) => p.latitude));
    const minLng = Math.min(...allPoints.map((p) => p.longitude));
    const maxLng = Math.max(...allPoints.map((p) => p.longitude));

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: maxLat - minLat + 0.01,
      longitudeDelta: maxLng - minLng + 0.01,
    };
  };

  useEffect(() => {
    getCurrentLocation()
      .then((location) => {
        if (location) {
          setLocation(location);
          setMapRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
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

  useEffect(() => {
    if (params.routeDetails) {
      const routeDetails = JSON.parse(params.routeDetails as string);
      console.log("Route Details:", routeDetails);
    }
  }, [params]);

  return (
    <SafeAreaView style={styles.container}>
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
  buttonContainer: {
    position: "absolute",
    bottom: 140,
    right: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
  },
});
