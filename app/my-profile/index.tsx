import { Buffer } from "buffer";
import "react-native-url-polyfill/auto";
import React, { useEffect, useLayoutEffect, useState } from "react";
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
import { Link } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { decode as base64ToArrayBuffer } from "base64-arraybuffer";
import Spinner from "react-native-loading-spinner-overlay";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/context/AuthContext";
import { showErrorToast, showSuccessToast } from "@/utils/toast";

export default function MyProfile() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const { session, userData } = useAuth();

  const [formValues, setFormValues] = useState({
    name: "",
    email: session?.user.email ?? "",
    mobile: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("*")
      .eq("user_id", session?.user.id)
      .then(({ data, error }) => {
        if (error) {
          showErrorToast("Error fetching user data");
        } else if (data && data.length > 0) {
          setFormValues({
            name: data[0].username,
            email: session?.user.email ?? "",
            mobile: data[0].mobile,
            age: data[0].age?.toString() ?? "",
            gender: data[0].gender,
            weight: data[0].weight?.toString() ?? "",
            height: data[0].height?.toString() ?? "",
          });
          setAvatarUrl(data[0].avatar_url);
        }
      });
  }, []);

  const handleSave = async () => {
    await supabase
      .from("profiles")
      .upsert({
        user_id: session?.user.id,
        username: formValues.name,
        mobile: formValues.mobile,
        age: formValues.age,
        gender: formValues.gender,
        weight: formValues.weight,
        height: formValues.height,
      })
      .then(({ error }) => {
        if (error) {
          showErrorToast("Error updating user data");
        } else {
          showSuccessToast("User data updated successfully");
        }
      });
  };

  const handleGenderSelect = (selectedGender: "Male" | "Female") => {
    setFormValues((prevValues) => ({ ...prevValues, gender: selectedGender }));
    setModalVisible(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormValues((prevValues) => ({ ...prevValues, [field]: value }));
  };

  const uploadImage = async () => {
    try {
      setUploading(true);
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showErrorToast("Permission to access media library is required!");
        return;
      }
      const picker = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (picker.canceled) return;
      const imageUri = picker.assets[0].uri;
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const buffer = Buffer.from(base64, "base64");
      const ext = imageUri.split(".").pop();
      const fileName = `${session?.user.id}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(fileName, buffer, {
          upsert: true,
          contentType: "image/jpeg",
        });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      const publicUrl = data.publicUrl;

      const { error: updErr } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("user_id", session?.user.id);
      if (updErr) throw updErr;
      setAvatarUrl(publicUrl);
      showSuccessToast("Avatar updated successfully");
    } catch (err) {
      console.error(err);
      showErrorToast("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.topMargin, { backgroundColor: "#007bff" }]}></View>

      <View style={[styles.header, { backgroundColor: "#007bff" }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profilee</Text>
      </View>

      <View style={[styles.bannerSection, { backgroundColor: "#007bff" }]}>
        <Image
          source={
            avatarUrl ? { uri: avatarUrl } : require("@/assets/images/111.png")
          }
          style={[styles.image, { borderColor: "#007bff" }]}
          resizeMode="cover"
        />
        <Text style={styles.name}>{userData?.username}</Text>

        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.changeAvatarButton}
            onPress={uploadImage}
          >
            <Text style={styles.changeAvatarButtonText}>Change Avatar</Text>
          </TouchableOpacity>
        </View>
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
          <Text style={styles.menuText}>Weight (kg)</Text>
          <TextInput
            style={styles.inputField}
            value={formValues.weight}
            onChangeText={(text) => handleInputChange("weight", text)}
            placeholder="Enter your weight"
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.separator} />

        <View style={styles.menuItem}>
          <Text style={styles.menuText}>Height (cm)</Text>
          <TextInput
            style={styles.inputField}
            value={formValues.height}
            onChangeText={(text) => handleInputChange("height", text)}
            placeholder="Enter your height"
            keyboardType="number-pad"
          />
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

      <View style={{ backgroundColor: "#fff", paddingBottom: 20 }}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

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
  avatarSection: {
    marginTop: 12,
    alignItems: "center",
  },
  changeAvatarButton: {
    backgroundColor: "#7d7d7d",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  changeAvatarButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  image: {
    borderRadius: 75,
    width: 150,
    height: 150,
    borderWidth: 5,
  },
});
