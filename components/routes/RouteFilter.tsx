import React, { useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { FontAwesome5 } from "@expo/vector-icons";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { LatLng } from "react-native-maps";
import { mainColor } from "@/constants/Colors";
import { getCurrentLocation } from "@/utils/location";
import { showErrorToast } from "@/utils/toast";
import { convertDateToString, convertTimeToString } from "@/utils/time";

export type RouteFilterProps = {
  start: LatLng;
  startLocationName: string;
  end: LatLng;
  endLocationName: string;
  date: string;
  time: string;
};

export default function RouteFilter({
  fetchRoutes,
  filters,
  setFilters,
}: {
  fetchRoutes: (filters: {
    origin: LatLng;
    destination: string;
    date: string;
    time: string;
  }) => void;
  filters: RouteFilterProps;
  setFilters: React.Dispatch<React.SetStateAction<RouteFilterProps>>;
}) {
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  // const [filters, setFilters] = useState<RouteFilterProps>({
  //   start: { latitude: 0, longitude: 0 },
  //   end: { latitude: 0, longitude: 0 },
  //   startLocationName: "",
  //   endLocationName: "",
  //   date: convertDateToString(new Date()),
  //   time: convertTimeToString(new Date()),
  // });

  useEffect(() => {
    getCurrentLocation()
      .then((resp) => {
        const { location, address } = resp;
        if (location) {
          setFilters((prev) => ({
            ...prev,
            start: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
            startLocationName: address,
          }));
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
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            Location
          </Text>
          <GooglePlacesAutocomplete
            placeholder={
              filters.startLocationName
                ? "Current Location"
                : "Search your location"
            }
            fetchDetails={true}
            disableScroll={true}
            onPress={(data, details) => {
              setFilters((prev) => ({
                ...prev,
                start: {
                  latitude:
                    details?.geometry.location.lat || prev.start.latitude,
                  longitude:
                    details?.geometry.location.lng || prev.start.longitude,
                },
                startLocationName: data.description,
              }));
            }}
            renderLeftButton={() => {
              return (
                <FontAwesome5
                  name="search"
                  size={24}
                  color={"#616161"}
                  style={{
                    marginVertical: 15,
                  }}
                />
              );
            }}
            query={{
              key: process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY,
              language: "id",
            }}
            styles={{
              container: styles.autoCompleteContainer,
              textInput: styles.autoCompleteInput,
              listView: styles.autoCompleteListView,
              textInputContainer: {
                paddingRight: 10,
                paddingLeft: 20,
              },
            }}
          />
        </View>

        <View
          style={{
            marginTop: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            Destination
          </Text>
          <GooglePlacesAutocomplete
            placeholder="Search your departure point"
            fetchDetails={true}
            disableScroll={true}
            onPress={(data, details) => {
              setFilters((prev) => ({
                ...prev,
                end: {
                  latitude: details?.geometry.location.lat || prev.end.latitude,
                  longitude:
                    details?.geometry.location.lng || prev.end.longitude,
                },
                endLocationName: data.description,
              }));
            }}
            renderLeftButton={() => {
              return (
                <FontAwesome5
                  name="search"
                  size={24}
                  color={"#616161"}
                  style={{
                    marginVertical: 15,
                  }}
                />
              );
            }}
            query={{
              key: process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY,
              language: "id",
            }}
            styles={{
              container: styles.autoCompleteContainer,
              textInput: styles.autoCompleteInput,
              listView: styles.autoCompleteListView,
              textInputContainer: {
                paddingRight: 10,
                paddingLeft: 20,
              },
            }}
          />
        </View>

        <View style={styles.datePickerContainer}>
          <View>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.datePickerButton}
            >
              <FontAwesome5 name="calendar-alt" size={24} color={"white"} />
              <Text style={{ color: "white", fontSize: 16 }}>
                {filters.date || new Date().toLocaleDateString("id-ID")}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <RNDateTimePicker
                mode="date"
                display="spinner"
                value={new Date()}
                onChange={(event, selectedDate) => {
                  if (event.type === "set") {
                    const currentDate = selectedDate || new Date();
                    setFilters((prev) => ({
                      ...prev,
                      date: convertDateToString(currentDate),
                    }));
                    setShowDatePicker(false);
                  } else {
                    setShowDatePicker(false);
                  }
                }}
              />
            )}
          </View>

          <View>
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              style={styles.datePickerButton}
            >
              <FontAwesome5 name="clock" size={24} color={"white"} />
              <Text style={{ color: "white", fontSize: 16 }}>
                {filters.time || new Date().toLocaleTimeString("id-ID")}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <RNDateTimePicker
                mode="time"
                display="spinner"
                timeZoneName="Asia/Jakarta"
                value={new Date()}
                onChange={(event, selectedTime) => {
                  if (event.type === "set") {
                    const currentTime = selectedTime || new Date();
                    setFilters((prev) => ({
                      ...prev,
                      time: convertTimeToString(currentTime),
                    }));
                    setShowTimePicker(false);
                  } else {
                    setShowTimePicker(false);
                  }
                }}
              />
            )}
          </View>
        </View>

        <View style={styles.findRouteContainer}>
          <TouchableOpacity
            onPress={() => {
              fetchRoutes({
                origin: filters.start,
                destination: filters.endLocationName,
                date: filters.date,
                time: filters.time,
              });
            }}
            style={styles.findRouteButton}
          >
            <Text style={styles.findRouteText}>Find Route and Transport</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
  filterContainer: {
    width: "100%",
    elevation: 2,
    paddingHorizontal: 24,
    paddingVertical: 28,
    borderRadius: 30,
    backgroundColor: "white",
    zIndex: 1,
  },
  datePickerContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: mainColor,
    borderRadius: 30,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  autoCompleteContainer: {
    marginTop: 10,
    width: "100%",
    borderWidth: 1,
    borderRadius: 30,
  },
  autoCompleteInput: {
    height: 56,
    fontSize: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  autoCompleteListView: {
    borderRadius: 10,
    position: "absolute",
    zIndex: 2,
    backgroundColor: "#fff",
    width: "100%",
    top: 70,
    elevation: 2,
  },
  findRouteContainer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  findRouteButton: {
    width: "100%",
    backgroundColor: mainColor,
    height: "auto",
    borderRadius: 30,
    paddingVertical: 10,
  },
  findRouteText: {
    textAlign: "center",
    fontSize: 18,
    color: "white",
  },
});
