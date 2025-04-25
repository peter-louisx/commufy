import React, { useState } from "react";
import { View, Button } from "react-native";
import ToastNotification from "../../components/toast/ToastNotification";

const ExampleScreen = () => {
  const [showToast, setShowToast] = useState(false);

  const handleShowToast = () => setShowToast(true);
  const handleCloseToast = () => setShowToast(false);

  return (
    <View>
      <Button title="Show Toast" onPress={handleShowToast} />
      <ToastNotification
        visible={showToast}
        title="Hujan Badai"
        message="Segera persiapkan jas hujan!"
        onClose={handleCloseToast}
      />
    </View>
  );
};

export default ExampleScreen;
