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
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { FontAwesome5 } from "@expo/vector-icons";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { LatLng } from "react-native-maps";
import { color } from "@rneui/themed/dist/config";
import { mainColor } from "@/constants/Colors";

export default function MuRoute() {
  const { colors } = useTheme();
  const router = useRouter();
  const navigation = useNavigation();

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [filters, setFilters] = useState<{
    start: LatLng;
    startLocationName: string;
    end: LatLng;
    endLocationName: string;
    date: string;
    time: string;
  }>({
    start: { latitude: 0, longitude: 0 },
    end: { latitude: 0, longitude: 0 },
    startLocationName: "",
    endLocationName: "",
    date: new Date().toLocaleDateString("id-ID"),
    time: new Date().toLocaleTimeString("id-ID"),
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#fff" }]}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.topMargin, { backgroundColor: "#007bff" }]}></View>
      <View
        style={{
          // backgroundColor: "black",
          height: 500,
          position: "relative",
        }}
      >
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>MuRoute</Text>
        </View>

        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
            position: "absolute",
            width: "100%",
            bottom: 0,
          }}
        >
          <View
            style={{
              width: "100%",
              borderWidth: 1,
              paddingHorizontal: 24,
              paddingVertical: 28,
              borderRadius: 30,
              backgroundColor: "white",
            }}
          >
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
                Location
              </Text>
              <GooglePlacesAutocomplete
                placeholder="Search your departure point"
                fetchDetails={true}
                query={{
                  key: process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY,
                  language: "id",
                }}
                styles={{
                  container: {
                    flex: 0,
                    marginTop: 10,
                  },
                  textInputContainer: {
                    height: 56,
                    alignItems: "center",
                  },
                  textInput: {
                    height: 56,
                    borderRadius: 30,
                    fontSize: 16,
                    borderWidth: 1,
                  },
                  listView: {
                    borderRadius: 10,
                    position: "absolute",
                    zIndex: 1,
                    backgroundColor: "#fff",
                    width: "100%",
                    marginTop: 60,
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
                placeholder="Where do you want to go?"
                fetchDetails={true}
                query={{
                  key: process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY,
                  language: "id",
                }}
                styles={{
                  container: {
                    flex: 0,
                    marginTop: 10,
                  },
                  textInputContainer: {
                    height: 56,
                    alignItems: "center",
                  },
                  textInput: {
                    height: 56,
                    borderRadius: 30,
                    fontSize: 16,
                    borderWidth: 1,
                  },
                  listView: {
                    borderRadius: 10,
                    position: "absolute",
                    zIndex: 1,
                    backgroundColor: "#fff",
                    width: "100%",
                    marginTop: 60,
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
                    paddingHorizontal: 30,
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
                        const year = currentDate.getFullYear();
                        const month = (currentDate.getMonth() + 1)
                          .toString()
                          .padStart(2, "0");
                        const day = currentDate
                          .getDate()
                          .toString()
                          .padStart(2, "0");
                        const formattedDate = `${year}-${month}-${day}`;
                        setFilters((prev) => ({
                          ...prev,
                          date: formattedDate,
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
                    paddingHorizontal: 30,
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
                        const hours = currentTime
                          .getHours()
                          .toString()
                          .padStart(2, "0");
                        const minutes = currentTime
                          .getMinutes()
                          .toString()
                          .padStart(2, "0");

                        const formattedTime = `${hours}:${minutes}`;
                        setFilters((prev) => ({
                          ...prev,
                          time: formattedTime,
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
                onPress={() => setShowTimePicker(true)}
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
      </View>
      <ScrollView contentContainerStyle={styles.menuContainer}></ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: 15,
    width: "100%",
    position: "relative",
  },
  autocompleteInput: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 10,
    borderWidth: 1,
    height: 50,
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
  topMargin: {
    height: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    height: 160,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerBack: {
    position: "absolute",
    left: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    paddingRight: 20,
    flex: 1,
  },

  menuContainer: {
    backgroundColor: "#fff",
  },
});
