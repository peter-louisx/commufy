import {
  Image,
  StyleSheet,
  Pressable,
  View,
  Text,
  FlatList,
} from "react-native";
import "react-native-get-random-values";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import { GoogleAPI } from "@/api/google";
import { getCurrentLocation } from "@/utils/location";
import { showErrorToast } from "@/utils/toast";

type WeatherInfo = {
  interval: {
    startTime: string;
    endTime: string;
  };
  isDayTime: boolean;
  weatherCondition: {
    iconBaseUri: string;
    description: {
      text: string;
      language: string;
    };
    type: string;
  };
  temperature: {
    degrees: number;
    unit: string;
  };
  relativeHumidity: number;
  uvIndex: number;
  precipitation: {
    probability: {
      percent: number;
      type: string;
    };
  };
  thunderstormProbability: number;
};

const cities = [
  { name: "Use Current Location", latitude: null, longitude: null },
  { name: "Jakarta", latitude: -6.2, longitude: 106.816666 },
  { name: "Bandung", latitude: -6.914744, longitude: 107.60981 },
  { name: "Surabaya", latitude: -7.257472, longitude: 112.75209 },
  { name: "Yogyakarta", latitude: -7.797068, longitude: 110.370529 },
];

export default function HomeScreen() {
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo[]>([]);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [isCityListOpen, setIsCityListOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateWeather = () => {
      if (selectedCity.latitude !== null && selectedCity.longitude !== null) {
        GoogleAPI.getWeatherDetails(
          selectedCity.latitude,
          selectedCity.longitude
        )
          .then((response) => {
            setWeatherInfo(response.data.forecastHours);
          })
          .catch((error) => {
            showErrorToast(error.message);
          });
      } else {
        getCurrentLocation()
          .then((locationData) => {
            const { latitude, longitude } = locationData.location.coords;
            GoogleAPI.getWeatherDetails(latitude, longitude).then(
              (response) => {
                setWeatherInfo(response.data.forecastHours);
              }
            );
          })
          .catch((error) => {
            showErrorToast(error.message);
          });
      }
    };

    const updateWeatherInterval = setInterval(updateWeather, 600000);

    updateWeather(); // initial fetch

    return () => clearInterval(updateWeatherInterval);
  }, [selectedCity]);

  const filteredWeatherInfo = weatherInfo.filter((info) => {
    const currentTimeDate = new Date();
    const oneHourLater = new Date(currentTimeDate.getTime() + 60 * 60 * 1000);
    const startTime = new Date(info.interval.startTime);
    const endTime = new Date(info.interval.endTime);

    return (
      startTime <= oneHourLater &&
      currentTimeDate <= endTime &&
      currentTimeDate >= startTime
    );
  });

  const handleCitySelect = (city: (typeof cities)[number]) => {
    setSelectedCity(city);
    setIsCityListOpen(false);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Weather Information</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedText type="subtitle">Current Time: {currentTime}</ThemedText>

      {/* Manual Dropdown */}
      <View style={styles.dropdownContainer}>
        <Pressable
          style={styles.dropdownButton}
          onPress={() => setIsCityListOpen(!isCityListOpen)}
        >
          <Text style={styles.dropdownButtonText}>{selectedCity.name}</Text>
        </Pressable>

        {isCityListOpen && (
          <View style={styles.dropdownList}>
            {cities.map((city, index) => (
              <Pressable
                key={index}
                style={styles.dropdownItem}
                onPress={() => handleCitySelect(city)}
              >
                <Text>{city.name}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Weather Info */}
      {filteredWeatherInfo.length > 0 ? (
        filteredWeatherInfo.map((info, index) => (
          <ThemedView key={index} style={styles.stepContainer}>
            <ThemedText type="subtitle">
              Expected: {info.weatherCondition.description.text}
            </ThemedText>
          </ThemedView>
        ))
      ) : (
        <ThemedText>No weather data available for the next hour.</ThemedText>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  dropdownContainer: {
    marginVertical: 12,
    backgroundColor: "#eee",
    borderRadius: 8,
    overflow: "hidden",
  },
  dropdownButton: {
    padding: 12,
    backgroundColor: "#ddd",
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  dropdownList: {
    backgroundColor: "#f9f9f9",
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
