import { mainColor } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { Fragment } from "react";
import {
  ScrollView,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { Route } from "../travel";

export default function UniversalQR() {
  const params = useGlobalSearchParams();
  const { colors } = useTheme();
  const router = useRouter();

  const routeDetails = JSON.parse(params.routeDetails as string) as Route;

  return (
    <Fragment>
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={[styles.topMargin, { backgroundColor: "#007bff" }]} />
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Universal QR</Text>
        </View>
        <View
          style={{
            paddingHorizontal: 20,
            position: "relative",
            top: -60,
            width: "100%",
          }}
        >
          <View
            style={{
              width: "100%",
              elevation: 2,
              paddingHorizontal: 24,
              paddingVertical: 28,
              borderRadius: 30,
              backgroundColor: "white",
              zIndex: 1,
            }}
          >
            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("@/assets/images/dummy-qr-code.png")}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          paddingHorizontal: 20,
          paddingVertical: 20,
          backgroundColor: "#fff",
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: mainColor,
            paddingVertical: 16,
            borderRadius: 30,
            alignItems: "center",
          }}
          onPress={() => {
            router.push({
              pathname: "/travel",
              params: {
                routeDetails: JSON.stringify(routeDetails),
              },
            });
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    paddingRight: 20,
    flex: 1,
  },
});
