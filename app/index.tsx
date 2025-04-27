import { mainColor } from "@/constants/Colors";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/components/context/AuthContext";

export default function Landing() {
  const router = useRouter();

  const { session } = useAuth();

  const handleGetStarted = () => {
    router.push("/login");
  };

  useEffect(() => {
    if (session) {
      router.push("(tabs)" as any);
    }
  }, [session]);

  return (
    <ImageBackground
      source={require("@/assets/images/landing.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Commufy</Text>
        <Text style={styles.subtitle}>
          Helps you find the best public transportation routes fast,
          comfortable, and integrated.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
          <FontAwesome5
            name="arrow-right"
            size={16}
            color="#fff"
            style={{ marginLeft: 10 }}
          />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: mainColor,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
  },
  button: {
    backgroundColor: mainColor,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
