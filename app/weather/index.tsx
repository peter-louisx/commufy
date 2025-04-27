import { Image, StyleSheet, Platform, Pressable } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, router } from "expo-router";
import "react-native-get-random-values";
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

export default function HomeScreen() {
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo[]>([]);

  useEffect(() => {
    getCurrentLocation()
      .then((locationData) => {
        const { latitude, longitude } = locationData.location.coords;
        GoogleAPI.getWeatherDetails(latitude, longitude).then((response) => {
          setWeatherInfo(response.data.forecastHours);
        });
      })
      .catch((error) => {
        showErrorToast(error.message);
      });
  }, []);

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
        <ThemedText type="title">Testing Weather Information</ThemedText>
        <HelloWave />
      </ThemedView>

      {weatherInfo.map((info, index) => (
        <ThemedView key={index} style={styles.stepContainer}>
          <ThemedText type="subtitle">
            {new Date(info.interval.startTime).toLocaleString()} -{" "}
            {new Date(info.interval.endTime).toLocaleString()}
          </ThemedText>
          <ThemedText>
            Condition: {info.weatherCondition.description.text}
          </ThemedText>
          <ThemedText>
            Temperature: {info.temperature.degrees} {info.temperature.unit}
          </ThemedText>
          <ThemedText>Humidity: {info.relativeHumidity}%</ThemedText>
          <ThemedText>UV Index: {info.uvIndex}</ThemedText>
          <ThemedText>
            Precipitation Probability: {info.precipitation.probability.percent}%
          </ThemedText>
          <ThemedText>
            Thunderstorm Probability: {info.thunderstormProbability}%
          </ThemedText>
        </ThemedView>
      ))}
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
});
