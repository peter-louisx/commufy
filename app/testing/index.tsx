import React, { useState } from "react";
import { View, Button, ScrollView } from "react-native";
import ToastNotification from "../../components/toast/ToastNotification";
import WeatherCard from "../../components/weather/WeatherCard";

const ExampleScreen = () => {
  const [showToast, setShowToast] = useState(false);

  const handleShowToast = () => setShowToast(true);
  const handleCloseToast = () => setShowToast(false);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Show Toast" onPress={handleShowToast} />
      <ToastNotification
        visible={showToast}
        title="Hujan Badai"
        message="Segera persiapkan jas hujan!"
        onClose={handleCloseToast}
      />

      <ScrollView style={{ marginTop: 20 }}>
        <WeatherCard
          temperature={28}
          location="Bandung, Indonesia"
          icon="sunny"
        />
      </ScrollView>
    </View>
  );
};

export default ExampleScreen;
