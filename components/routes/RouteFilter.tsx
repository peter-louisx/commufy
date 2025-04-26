import React, { useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { FontAwesome5 } from "@expo/vector-icons";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { LatLng } from "react-native-maps";
import { color } from "@rneui/themed/dist/config";
import { mainColor } from "@/constants/Colors";
import { Filter } from "react-native-svg";

export type RouteFilterProps = {
  start: LatLng;
  startLocationName: string;
  end: LatLng;
  endLocationName: string;
  date: string;
  time: string;
};

const convertDateToString = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const convertTimeToString = (time: Date) => {
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}:00`;
};

export default function RouteFilter({
  fetchRoutes,
}: {
  fetchRoutes: (filters: {
    origin: LatLng;
    destination: string;
    date: string;
    time: string;
  }) => void;
}) {
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [filters, setFilters] = useState<RouteFilterProps>({
    start: { latitude: 0, longitude: 0 },
    end: { latitude: 0, longitude: 0 },
    startLocationName: "",
    endLocationName: "",
    date: convertDateToString(new Date()),
    time: convertTimeToString(new Date()),
  });

  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingTop: 20,
        position: "absolute",
        width: "100%",
        bottom: 0,
      }}
    >
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
            placeholder="Search your starting point"
            fetchDetails={true}
            disableScroll={true}
            onPress={(data, details: any) => {
              setFilters((prev) => ({
                ...prev,
                start: {
                  latitude: details?.geometry.location.lat,
                  longitude: details?.geometry.location.lng,
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
            zIndex: 1,
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
            onPress={(data, details: any) => {
              setFilters((prev) => ({
                ...prev,
                start: {
                  latitude: details?.geometry.location.lat,
                  longitude: details?.geometry.location.lng,
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
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <View>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                backgroundColor: mainColor,
                borderRadius: 30,
                paddingHorizontal: 13,
                paddingVertical: 8,
              }}
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
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                backgroundColor: mainColor,
                borderRadius: 30,
                paddingHorizontal: 13,
                paddingVertical: 8,
              }}
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

        <View
          style={{
            marginTop: 30,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              fetchRoutes({
                origin: filters.start,
                destination: filters.endLocationName,
                date: filters.date,
                time: filters.time,
              });
            }}
            style={{
              width: "100%",
              backgroundColor: mainColor,
              height: "auto",
              borderRadius: 30,
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                color: "white",
              }}
            >
              Find Route and Transport
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  filterContainer: {
    width: "100%",
    elevation: 2,
    paddingHorizontal: 24,
    paddingVertical: 28,
    borderRadius: 30,
    backgroundColor: "white",
    zIndex: 1,
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
});
