import {
  Image,
  StyleSheet,
  Platform,
  ScrollView,
  View,
  Text,
} from "react-native";
import { Link } from "expo-router";
import { mainColor } from "@/constants/Colors";
import WeatherCard from "@/components/weather/WeatherCard";
import { FontAwesome5 } from "@expo/vector-icons";
import Icons from "@/components/icons";
import { useAuth } from "@/components/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { showErrorToast } from "@/utils/toast";

export default function HomeScreen() {
  const { session, userData } = useAuth();

  const [travelHistory, setTravelHistory] = useState<
    {
      destination: string;
      origin: string;
      departured_at: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchTravelHistory = async () => {
      if (session) {
        const { data, error } = await supabase
          .from("travel_history")
          .select("*")
          .eq("user_id", session.user.id);

        if (error) {
          showErrorToast(
            "Failed to fetch travel history. Please try again later."
          );
        } else {
          setTravelHistory(data);
        }
      }
    };

    fetchTravelHistory();
  }, []);

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View
        style={{
          height: 275,
          position: "relative",
        }}
      >
        <View
          style={{
            backgroundColor: mainColor,
            height: 220,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 80,
              paddingHorizontal: 16,
            }}
          >
            <View>
              {session && userData && (
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                  }}
                >
                  {userData.username}
                </Text>
              )}

              <Text
                style={{
                  color: "white",
                  fontSize: 24,
                  fontWeight: "bold",
                }}
              >
                Good Morning
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
              }}
            >
              <Icons.Notification size={32} color={"white"} />
              <Image
                source={require("@/assets/images/111.png")}
                style={{
                  width: 40,
                  height: 40,
                }}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <WeatherCard
            temperature={28}
            location="Bandung, Indonesia"
            icon="sunny"
          />
        </View>
      </View>

      <View
        style={{
          padding: 16,
        }}
      >
        <Link href={"/route"}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 16,
              borderWidth: 1,
              borderColor: mainColor,
              borderRadius: 48,
            }}
          >
            <FontAwesome5
              name="search"
              size={24}
              color={"#616161"}
              style={{}}
            />

            <View
              style={{
                flex: 1,
                paddingLeft: 16,
              }}
            >
              <Text
                style={{
                  textAlign: "left",
                  color: "#616161",
                  fontSize: 16,
                }}
              >
                Where are you going today?
              </Text>
            </View>
          </View>
        </Link>
      </View>

      <View
        style={{
          padding: 16,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#11181C",
            marginBottom: 16,
          }}
        >
          Your Favourite
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
            borderWidth: 1,
            borderColor: mainColor,
            borderRadius: 48,
            borderStyle: "dashed",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: mainColor,
                fontSize: 16,
              }}
            >
              Add your favorite
            </Text>
            <FontAwesome5 name="plus" size={24} color={mainColor} />
          </View>
        </View>
      </View>

      <View
        style={{
          padding: 16,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#11181C",
            marginBottom: 16,
          }}
        >
          Your History
        </Text>
        {travelHistory.length > 0 ? (
          travelHistory.map((history, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 16,
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                marginBottom: 8,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#11181C",
                  }}
                >
                  {`${history.origin.slice(
                    0,
                    15
                  )}... → ${history.destination.slice(0, 15)}..`}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#616161",
                  }}
                >
                  {history.departured_at}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: mainColor,
                  fontSize: 16,
                }}
              >
                No history yet
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
