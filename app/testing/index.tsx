import React, { useState } from "react";
import { View, Button, ScrollView, Pressable } from "react-native";
import ToastNotification from "../../components/toast/ToastNotification";
import WeatherCard from "../../components/weather/WeatherCard";
import { useGlobalSearchParams, useRouter } from "expo-router";

const ExampleScreen = () => {
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  const params = useGlobalSearchParams();

  React.useEffect(() => {
    if (params.routeDetails) {
      const routeDetails = JSON.parse(params.routeDetails as string);
      console.log("Route Details:", routeDetails);
    }
  }, [params]);

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
        <Pressable onPress={() => router.navigate("/weather" as any)}>
          <WeatherCard
            temperature={28}
            location="Bandung, Indonesia"
            icon="sunny"
          />
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default ExampleScreen;
