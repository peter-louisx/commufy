import * as Location from "expo-location";
  
export async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
        throw new Error("Permission to access location was denied");
    }

    let location = await Location.getCurrentPositionAsync({});

    let address = "Unknown location";

    

    const { coords } = location;

    if (coords) {
        const { latitude, longitude } = coords;

        let response = Location.reverseGeocodeAsync({
            latitude,
            longitude,
        });

        address = await response.then((data) => {
            if (data.length > 0) {
                return data[0].formattedAddress as string;
            } else {
                return "Unknown location";
            }
        }
        );

    } else {
        throw new Error("Unable to retrieve location coordinates");
    }
      
    return {location, address};
}

