import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface WeatherCardProps {
  temperature: number;
  location: string;
  icon: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  temperature,
  location,
  icon,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.temperature}>{temperature}°C</Text>
        <View style={styles.weatherInfo}>
          <Ionicons name={icon} size={32} color="#fff" />
          <Text style={styles.location}>{location}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#007bff", // Blue gradient
    borderRadius: 12,
    padding: 16,
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  temperature: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "600",
    marginRight: 12,
  },
  weatherInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 8,
  },
});

export default WeatherCard;
