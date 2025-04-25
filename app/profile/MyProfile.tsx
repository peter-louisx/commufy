import React, { useLayoutEffect, useState } from "react";
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
import { Link } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [formValues, setFormValues] = useState({
    name: "John Doe",
    email: "youremail@gmail.com",
    mobile: "+62 123 4567 8910",
    age: "24",
    gender: "Female",
  });

  const [modalVisible, setModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleSave = () => {
    console.log("Profile saved", formValues);
    // generated api//
    // fetch('api url', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(formValues),
    // })
    //   .then(response => response.json())
    //   .then(data => console.log(data))
    //   .catch(error => console.error('Error:', error));
  };

  const handleGenderSelect = (selectedGender: "Male" | "Female") => {
    setFormValues((prevValues) => ({ ...prevValues, gender: selectedGender }));
    setModalVisible(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormValues((prevValues) => ({ ...prevValues, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.topMargin, { backgroundColor: "#007bff" }]}></View>

      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
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
        <View style={styles.menuItem}>
          <Text style={styles.menuText}>Name</Text>
          <TextInput
            style={styles.inputField}
            value={formValues.name}
            onChangeText={(text) => handleInputChange("name", text)}
            placeholder="Enter your name"
          />
        </View>

        <View style={styles.separator} />

        <View style={styles.menuItem}>
          <Text style={styles.menuText}>Email Account</Text>
          <TextInput
            style={styles.inputField}
            value={formValues.email}
            onChangeText={(text) => handleInputChange("email", text)}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
        </View>
        <View style={styles.separator} />

        <View style={styles.menuItem}>
          <Text style={styles.menuText}>Mobile Number</Text>
          <TextInput
            style={styles.inputField}
            value={formValues.mobile}
            onChangeText={(text) => handleInputChange("mobile", text)}
            placeholder="Enter your mobile number"
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.separator} />

        <View style={styles.menuItem}>
          <Text style={styles.menuText}>Gender</Text>
          <TouchableOpacity
            style={styles.inputField}
            onPress={() => setModalVisible(true)}
          >
            <Text>{formValues.gender}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />

        <View style={styles.menuItem}>
          <Text style={styles.menuText}>Age</Text>
          <TextInput
            style={styles.inputField}
            value={formValues.age}
            onChangeText={(text) => handleInputChange("age", text)}
            placeholder="Enter your age"
            keyboardType="number-pad"
          />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonMargin]}
              onPress={() => handleGenderSelect("Male")}
            >
              <Text style={styles.modalButtonText}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonMargin]}
              onPress={() => handleGenderSelect("Female")}
            >
              <Text style={styles.modalButtonText}>Female</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topMargin: {
    height: 30,
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
  inputField: {
    flex: 1,
    padding: 10,
    marginLeft: 12,
    fontSize: 16,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 5,
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginLeft: 20,
  },
  saveButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    borderRadius: 25,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  modalButtonMargin: {
    marginBottom: 10,
  },
  modalButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  cancelButton: {
    backgroundColor: "red",
  },
});
