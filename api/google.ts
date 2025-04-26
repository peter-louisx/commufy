import axios from './axios'

export const GoogleAPI = {
    async getTargetRouteDetails(address : string, lat : number, lng : number, date: string = "2023-10-01", time: string = "12:00:00") {
        const departureTime = `${date}T${time}Z`;
        return await axios.post(`https://routes.googleapis.com/directions/v2:computeRoutes`, {
            "origin": {
            "location": {
                "latLng": {
                  "latitude": lat,
                  "longitude": lng
                }
              }
            },
            "destination": {
              "address": address,
            },
            "travelMode": "TRANSIT",
            // "departureTime": departureTime,
            "computeAlternativeRoutes": true
        } ,
        {
            headers : {
            "X-Goog-Api-Key": process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY,
            "X-Goog-FieldMask": "routes.*",
            }
        })
    } ,
    async getWeatherDetails(lat : number, lng : number, hours: number = 24) {
        return await axios.get(`https://weather.googleapis.com/v1/forecast/hours:lookup`, {
            params: {
                "key": process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY,
                "location.latitude": lat,
                "location.longitude": lng,
                "hours": hours,
            },
            headers : {
                "X-Goog-Api-Key": process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY,
            }
        })
    }
}