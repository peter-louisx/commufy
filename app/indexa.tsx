// ini cuman buat backup

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
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [mapRegion, setMapRegion] = useState<Region | undefined>(undefined);
  const [availableRoutes, setAvailableRoutes] = useState<Route[]>([]);

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

  const setTargetRoute = (route: Route) => {
    const steps = route.legs[0].steps.map(
      (step: { polyline: { encodedPolyline: string }; travelMode: string }) => {
        const points = polyline.decode(step.polyline.encodedPolyline);

        return points.map((point: number[]) => ({
          latitude: point[0],
          longitude: point[1],
          travelMode: step.travelMode,
        }));
      }
    );
    setRouteSteps(steps);
    setMapRegion(getRegionPositionAfterRoute(steps));
    setModalVisible(false);
    setEndLocation({
      latitude: route.legs[0].endLocation.latLng.latitude,
      longitude: route.legs[0].endLocation.latLng.longitude,
    });
  };

  async function getRouteDetails(address: string) {
    if (location?.coords) {
      const { latitude, longitude } = location.coords;
      try {
        const response = await GoogleAPI.getTargetRouteDetails(
          address,
          latitude,
          longitude
        );

        const {
          routes,
        }: {
          routes: Route[];
        } = response.data;

        setAvailableRoutes(routes);
        setModalVisible(true);
      } catch (error) {
        showErrorToast("Failed to fetch route details. Please try again.");
      }
    } else {
      showErrorToast("Location not found. Please enable location services.");
    }
  }

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.autoCompleteView}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          fetchDetails={true}
          onPress={(data, details = null) => {
            getRouteDetails(data.description);
          }}
          query={{
            key: process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY,
            language: "id",
          }}
          styles={{
            container: styles.autocompleteContainer,
            textInput: styles.autocompleteInput,
            listView: styles.autoCompleteList,
          }}
        />
      </View>

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

        {/* Button to show modal */}
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Show Modal</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={availableRoutes}
              keyExtractor={(item, index) => index.toString()}
              style={{
                width: "100%",
                paddingVertical: 10,
              }}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setTargetRoute(item)}
                  style={{
                    borderWidth: 1,
                    width: "100%",
                    padding: 10,
                    borderRadius: 5,
                    marginVertical: 5,
                  }}
                >
                  <Text style={{ fontSize: 16, marginBottom: 10 }}>
                    Durasi: {item.localizedValues.duration.text}
                  </Text>
                  {item.travelAdvisory.transitFare.units && (
                    <Text style={{ fontSize: 16, marginBottom: 10 }}>
                      Harga: {item.travelAdvisory.transitFare.units}
                    </Text>
                  )}
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                    }}
                  >
                    {item.legs[0].stepsOverview.multiModalSegments.map(
                      (segment, index) => (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 5,
                          }}
                        >
                          <FontAwesome5
                            name={
                              segment.travelMode === "WALK" ? "walking" : "bus"
                            }
                            size={16}
                            color="black"
                            style={{ marginRight: 5 }}
                          />
                          {index !=
                            item.legs[0].stepsOverview.multiModalSegments
                              .length -
                              1 && (
                            <FontAwesome5
                              name="arrow-right"
                              size={16}
                              color="black"
                              style={{ marginRight: 5 }}
                            />
                          )}
                        </View>
                      )
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingTop: 20,
    backgroundColor: "white",
    flexDirection: "column",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  autoCompleteView: {
    width: "100%",
    height: 65,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  autocompleteContainer: {
    width: "100%",
    zIndex: 1,
  },
  autocompleteInput: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  autoCompleteList: {
    backgroundColor: "white",
    borderRadius: 5,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    position: "absolute",
    top: 70,
    marginHorizontal: 10,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "100%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
