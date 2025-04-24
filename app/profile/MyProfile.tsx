// pages/MyProfile.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MyProfile() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to My Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
  },
});
