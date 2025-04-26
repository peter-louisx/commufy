import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { mainColor } from "@/constants/Colors";
import { useRouter } from "expo-router";

const LoginScreen = () => {
  const router = useRouter();

  const handleGoogleLogin = () => {
    router.push("(tabs)" as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image
          source={require("@/assets/images/login.png")}
          resizeMode="contain"
        />
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.title}>Commufy</Text>
        <Text style={styles.subtitle}>
          Hassle-free mobility, just one step away.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleGoogleLogin}>
          <FontAwesome name="google" size={20} />
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <FontAwesome name="apple" size={20} />
          <Text style={styles.buttonText}>Continue with Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <FontAwesome name="phone" size={20} />
          <Text style={styles.buttonText}>Continue with Phone</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F0FF",
    justifyContent: "space-between",
  },
  topSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 50,
  },
  imageContainer: {
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  label: {
    marginTop: 10,
    fontSize: 12,
    color: "#555",
  },
  bottomSection: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: mainColor,
  },
  subtitle: {
    fontSize: 14,
    color: "black",
    marginVertical: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: "90%",
    justifyContent: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    marginLeft: 10,
  },
});

export default LoginScreen;
