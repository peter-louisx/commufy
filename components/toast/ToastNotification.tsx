import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface ToastNotificationProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  visible,
  title,
  message,
  onClose,
}) => {
  const [showToast, setShowToast] = useState(visible);
  const opacity = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (visible) {
      setShowToast(true);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timeout = setTimeout(() => {
        onClose();
      }, 10000);

      return () => clearTimeout(timeout);
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowToast(false));
    }
  }, [visible, onClose]);

  if (!showToast) return null;

  return (
    <Animated.View style={[styles.toastContainer, { opacity }]}>
      <View style={styles.toast}>
        <Ionicons name="warning-outline" size={24} color="blue" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="chevron-down" size={24} color="blue" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  toast: {
    backgroundColor: "#fff",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontWeight: "bold",
    color: "black",
  },
  message: {
    color: "#777",
    fontSize: 14,
  },
});

export default ToastNotification;
