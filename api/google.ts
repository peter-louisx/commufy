import axios from './axios'

export const GoogleAPI = {
    async getTargetRouteDetails(address : string, lat : number, lng : number) {
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
                "computeAlternativeRoutes": true
        } ,
        {
            headers : {
                "X-Goog-Api-Key": process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY,
                "X-Goog-FieldMask": "routes.*",
            }
        })
    } 
}