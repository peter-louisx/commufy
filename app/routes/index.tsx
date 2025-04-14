import React, { useEffect, useState } from "react";
import { StyleSheet, Modal, Text, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import { View } from "react-native";
import { SafeAreaView } from "react-native";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import polyline from "@mapbox/polyline";
import { GoogleAPI } from "@/api/google";
import { Polyline } from "react-native-maps";
import { getCurrentLocation } from "@/utils/location";
import { showErrorToast, showSuccessToast } from "@/utils/toast";

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [routePointCoordinates, setRoutePointCoordinates] = useState<
    {
      latitude: number;
      longitude: number;
    }[]
  >([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  async function getRouteDetails(address: string) {
    if (location?.coords) {
      const { latitude, longitude } = location.coords;
      try {
        const response = await GoogleAPI.getTargetRouteDetails(
          address,
          latitude,
          longitude
        );

        const { routes } = response.data;
        if (routes.length > 0) {
          const points = polyline.decode(routes[0].polyline.encodedPolyline);
          const coordinates = points.map((point) => ({
            latitude: point[0],
            longitude: point[1],
          }));
          setRoutePointCoordinates(coordinates);
          // console.log("Route coordinates:", coordinates);
        }
      } catch (error) {
      }
    } else {
    }
  }

  useEffect(() => {
    getCurrentLocation()
      .then((location) => {
        if (location) {
          setLocation(location);
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
      <GooglePlacesAutocomplete
        placeholder="Search"
        fetchDetails={true}
        onPress={(data, details = null) => {
          // console.log(data, details);
          getRouteDetails(data.description);
        }}
        query={{
          key: "",
          language: "id",
        }}
        styles={{
          container: styles.autocompleteContainer,
          textInput: styles.autocompleteInput,
        }}
      />
      {location?.coords && (
        <MapView
          style={styles.map}
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          zoomEnabled={true}
          zoomControlEnabled={true}
        >
          {routePointCoordinates.length > 0 && (
            <Polyline
              coordinates={routePointCoordinates}
              strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
              strokeColors={[
                "#7F0000",
                "#000000",
                "#000000",
              strokeColor="#FF5733" // vibrant stroke color
              strokeWidth={8} // thicker line for better visibility
            />
          )}
        </MapView>
      )}
      {/* Button to show modal */}
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Show Modal</Text>
      </TouchableOpacity>
      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>This is a modal!</Text>
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
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  autocompleteContainer: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
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
  buttonContainer: {
    position: "absolute",
    bottom: 100,
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
    width: 300,
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
