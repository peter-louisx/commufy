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

export default function ProfileScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#fff" }]}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.topMargin, { backgroundColor: "#007bff" }]}></View>

      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={[styles.bannerSection, { backgroundColor: colors.primary }]}>
        <Image
          source={require("@/assets/images/111.png")}
          style={styles.bannerImage}
          resizeMode="contain"
        />
        <Text style={styles.name}>John Doe</Text>
      </View>

      <ScrollView contentContainerStyle={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.navigate("/my-profile" as any)}
        >
          <Ionicons name="person-outline" size={20} color="#333" />
          <Text style={styles.menuText}>My Profile</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.navigate("/testing") as any}
        >
          <Ionicons name="settings-outline" size={20} color="#333" />
          <Text style={styles.menuText}>Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity
          style={styles.menuItem}
          // onPress={() => router.navigate("/profile/notifications")}
        >
          <Ionicons name="notifications-outline" size={20} color="#333" />
          <Text style={styles.menuText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
        <View style={styles.separator} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => console.log("Logging out...")}
        >
          <MaterialIcons name="logout" size={20} color="#E63946" />
          <Text style={[styles.menuText, { color: "#E63946" }]}>Logout</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
      </ScrollView>
    </SafeAreaView>
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
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    paddingHorizontal: 16,
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
  bannerSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  bannerImage: {
    width: 150,
    height: 150,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  menuContainer: {
    backgroundColor: "#fff",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  menuText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginLeft: 20,
  },
});
