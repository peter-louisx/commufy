import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { StyleSheet, Text } from "react-native";
import MapView, {
  LatLng,
  Region,
  Polyline,
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { View } from "react-native";
import * as Location from "expo-location";
import polyline from "@mapbox/polyline";
import { GoogleAPI } from "@/api/google";
import { getCurrentLocation } from "@/utils/location";
import { FontAwesome5 } from "@expo/vector-icons";
import { useGlobalSearchParams } from "expo-router";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { convertSecondIntoMinute } from "@/utils/time";
import { mainColor } from "@/constants/Colors";

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
      navigationInstruction: {
        instructions: string;
      };
      localizedValues: {
        distance: {
          text: string;
        };
        staticDuration: {
          text: string;
        };
      };
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
  const [endLocation, setEndLocation] = useState<LatLng | null>(null);
  const [generalRouteInfo, setGeneralRouteInfo] = useState<{
    distance: string;
    duration: string;
    transitFare: string;
  } | null>(null);

  const [routeSteps, setRouteSteps] = useState<
    {
      latitude: number;
      longitude: number;
      travelMode: string;
    }[][]
  >([]);

  const [routeDescription, setRouteDescription] = useState<
    {
      instructions: string;
      distance: number;
      duration: string;
      travelMode: string;
      time: string;
    }[]
  >([]);

  const [mapRegion, setMapRegion] = useState<Region | undefined>(undefined);
  const params = useGlobalSearchParams();

  // hooks
  const sheetRef = useRef<BottomSheet>(null);

  // variables
  const data = useMemo(() => {
    return routeDescription.map((step) => ({
      travelMode: step.travelMode,
      instructions: step.instructions,
      distance: step.distance,
      duration: step.duration,
      time: step.time,
    }));
  }, [routeSteps]);

  const snapPoints = useMemo(() => ["15%", "25%", "50%", "90%"], []);

  const renderItem = useCallback(
    (item: any, index: number) => (
      <View
        key={index + "step"}
        style={{
          borderLeftWidth: 2,
          borderLeftColor: item.travelMode === "WALK" ? "#4287f5" : "#f54242",
          paddingBottom: 40,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <View
            style={{
              width: 15,
              height: 15,
              borderRadius: 30,
              backgroundColor: mainColor,
              position: "relative",
              left: -8,
            }}
          ></View>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 20,
              position: "relative",
              top: -5,
            }}
          >
            {item.time}
          </Text>
        </View>
        <View key={index} style={styles.itemContainer}>
          <FontAwesome5
            name={item.travelMode === "WALK" ? "walking" : "bus"}
            size={30}
            color={item.travelMode === "WALK" ? "#4287f5" : "#f54242"}
          />
          <Text
            style={{
              fontWeight: "bold",
            }}
          >
            {item.instructions}
          </Text>
          <Text>{item.distance} meters</Text>

          <Text>{convertSecondIntoMinute(item.distance)}</Text>
        </View>
      </View>
    ),
    []
  );

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
    if (params.routeDetails) {
      const routeDetails = JSON.parse(params.routeDetails as string) as Route;
      const steps = routeDetails.legs[0].steps.map((step) => {
        const decodedPolyline = polyline.decode(step.polyline.encodedPolyline);
        return decodedPolyline.map((point) => ({
          latitude: point[0],
          longitude: point[1],
          travelMode: step.travelMode,
          instructions: step.navigationInstruction.instructions,
          distance: step.distanceMeters,
          duration: step.staticDuration,
        }));
      });

      setGeneralRouteInfo({
        distance: routeDetails.localizedValues.distance.text,
        duration: routeDetails.localizedValues.duration.text,
        transitFare: routeDetails.travelAdvisory.transitFare.units,
      });

      const currentTime = new Date();

      const stepsDescription = routeDetails.legs[0].steps.map((step) => {
        const stepDurationInSeconds = parseInt(step.staticDuration, 10);
        const stepEndTime = new Date(
          currentTime.getTime() + stepDurationInSeconds * 1000
        );
        const formattedTime = stepEndTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        currentTime.setTime(stepEndTime.getTime());

        return {
          instructions: step.navigationInstruction.instructions,
          distance: step.distanceMeters,
          duration: step.staticDuration,
          travelMode: step.travelMode,
          time: formattedTime,
        };
      });

      const endLocation = routeDetails.legs[0].endLocation.latLng;

      setRouteDescription(stepsDescription);

      setEndLocation({
        latitude: endLocation.latitude,
        longitude: endLocation.longitude,
      });

      setRouteSteps(steps);
      setMapRegion({
        latitude: endLocation.latitude,
        longitude: endLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      setMapRegion(getRegionPositionAfterRoute(steps));
    }
  }, [params]);

  return (
    <GestureHandlerRootView style={styles.sheetContainer}>
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

      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
      >
        <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
          <ScrollView
            style={{
              flex: 1,
              paddingHorizontal: 10,
            }}
          >
            <View key="routeDetails">
              {generalRouteInfo && (
                <View key="generalInfo" style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 20,
                      marginBottom: 10,
                      textAlign: "center",
                    }}
                  >
                    {generalRouteInfo.duration}
                  </Text>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      marginBottom: 10,
                      textAlign: "center",
                    }}
                  >
                    {generalRouteInfo.distance}
                  </Text>

                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      marginBottom: 10,
                    }}
                  >
                    {generalRouteInfo.transitFare}
                  </Text>
                </View>
              )}
            </View>
            {data.map(renderItem)}
          </ScrollView>
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flexDirection: "column",
  },
  map: {
    width: "100%",
    height: "90%",
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

  sheetContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  itemContainer: {
    padding: 6,
    paddingLeft: 18,
  },
});
