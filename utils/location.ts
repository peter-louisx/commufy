import * as Location from "expo-location";
  
export async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
        throw new Error("Permission to access location was denied");
    }

    let location = await Location.getCurrentPositionAsync({});
    const { coords } = location;

    if (coords) {
        const { latitude, longitude } = coords;

        let response = Location.reverseGeocodeAsync({
            latitude,
            longitude,
        });
        // response.then((data) => {
        //     console.log("Location data:", data);
        // });
    } else {
        throw new Error("Unable to retrieve location coordinates");
    }
      
    return location;
}

