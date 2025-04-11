import { Image, StyleSheet, Platform } from "react-native";
import MapView from "react-native-maps";
import { View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} />
    </View>
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
});
