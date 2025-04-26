import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import RouteFilter from "@/components/routes/RouteFilter";
import { LatLng } from "react-native-maps";
import { GoogleAPI } from "@/api/google";
import { Route } from "../travel";
import { FontAwesome5 } from "@expo/vector-icons";
import { mainColor } from "@/constants/Colors";
import { convertSecondIntoMinute } from "@/utils/time";
import { showErrorToast } from "@/utils/toast";

type RootStackParamList = {
  routeDetails: { routeDetails: string };
};

export default function MuRoute() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const router = useRouter();

  const [routeStepsOverview, setRouteStepsOverview] = useState<
    {
      totalTime: string;
      overviewSteps: {
        totalTime: string;
        travelMode: string;
      }[];
      fullRouteInfo: Route;
    }[]
  >([]);

  const [selectedRoute, setSelectedRoute] = useState<number>(-1);
  const [loadingRoutes, setLoadingRoutes] = useState<boolean>(false);

  const calculateStepsIndex = (
    startIndex: number,
    endIndex: number,
    steps: {
      staticDuration: string;
    }[]
  ) => {
    const filteredSteps = steps.filter(
      (step, index) => index >= startIndex && index <= endIndex
    );

    const totalTime = filteredSteps.reduce((acc, step) => {
      const timeInSeconds = parseInt(step.staticDuration.replace("s", ""));
      return acc + timeInSeconds;
    }, 0);

    return totalTime.toString();
  };

  const fetchRoutes = async (filters: {
    origin: LatLng;
    destination: string;
    date: string;
    time: string;
  }) => {
    setLoadingRoutes(true);
    await GoogleAPI.getTargetRouteDetails(
      filters.destination,
      filters.origin.latitude,
      filters.origin.longitude,
      filters.date,
      filters.time
    )
      .then((res) => {
        setSelectedRoute(-1);

        const {
          routes,
        }: {
          routes: Route[];
        } = res.data;

        setRouteStepsOverview(
          routes.map((route: Route) => {
            const fullSteps = route.legs[0].steps;
            const steps = route.legs[0].stepsOverview.multiModalSegments.map(
              (step, index) => {
                return {
                  totalTime: calculateStepsIndex(
                    step.stepStartIndex,
                    step.stepEndIndex,
                    fullSteps
                  ),
                  travelMode: step.travelMode,
                };
              }
            );
            return {
              totalTime: route.localizedValues.duration.text,
              overviewSteps: steps,
              fullRouteInfo: route,
            };
          })
        );
      })
      .catch((err) => {
        showErrorToast("Error fetching routes. Please try again later.");
      })
      .finally(() => {
        setLoadingRoutes(false);
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <>
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
        <StatusBar barStyle="light-content" />

        <View style={[styles.topMargin, { backgroundColor: "#007bff" }]}></View>
        <View
          style={{
            height: 500,
            position: "relative",
          }}
        >
          <View style={[styles.header, { backgroundColor: colors.primary }]}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>MuRoute</Text>
          </View>

          <RouteFilter fetchRoutes={fetchRoutes} />
        </View>

        <View>
          {!loadingRoutes && routeStepsOverview.length > 0 && (
            <>
              <Text style={{ fontSize: 18, fontWeight: "bold", padding: 16 }}>
                Recommendation
              </Text>
              <View style={{ paddingHorizontal: 16 }}>
                {routeStepsOverview.map((route, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setSelectedRoute(index);
                    }}
                    activeOpacity={0.8}
                    style={[
                      styles.routeCard,
                      {
                        backgroundColor:
                          selectedRoute == index ? "#AFCAF7" : "white",
                      },
                    ]}
                  >
                    <View style={styles.routeInfo}>
                      <FontAwesome5
                        name="map-marker-alt"
                        size={24}
                        color="#007bff"
                        style={{
                          marginBottom: 8,
                          position: "relative",
                          left: -8,
                        }}
                      />
                      <Text style={styles.totalTime}>{route.totalTime}</Text>
                    </View>
                    {route.overviewSteps.map((step, stepIndex) => (
                      <View
                        key={stepIndex}
                        style={{
                          borderLeftWidth: 2,
                          borderLeftColor: mainColor,
                        }}
                      >
                        <View style={styles.routeCircle}></View>
                        <View
                          key={stepIndex}
                          style={[
                            styles.routeInfoContainer,
                            {
                              backgroundColor:
                                selectedRoute == index ? "#AFCAF7" : "white",
                            },
                          ]}
                        >
                          <View style={styles.travelIcon}>
                            <FontAwesome5
                              name={
                                step.travelMode === "TRANSIT"
                                  ? "bus"
                                  : "walking"
                              }
                              size={24}
                              color="white"
                            />
                          </View>
                          <View>
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                color: "black",
                              }}
                            >
                              {step.travelMode === "TRANSIT"
                                ? "Public Transport"
                                : "Walking"}
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                marginTop: 4,
                              }}
                            >
                              {convertSecondIntoMinute(
                                parseInt(step.totalTime)
                              )}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {loadingRoutes && (
            <View style={styles.loaderContainer}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Loading routes...
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {selectedRoute !== -1 && routeStepsOverview.length > 0 && (
        <View style={styles.findRouteContainer}>
          <TouchableOpacity
            style={styles.findRouteButton}
            onPress={() => {
              const selectedRouteDetails = routeStepsOverview[selectedRoute];
              setSelectedRoute(-1);
              setRouteStepsOverview([]);
              router.push({
                pathname: "/travel" as any,
                params: {
                  routeDetails: JSON.stringify(
                    selectedRouteDetails.fullRouteInfo
                  ),
                },
              });
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              Select Recommendation
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
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
    alignItems: "flex-start",
    justifyContent: "space-between",
    height: 160,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    paddingRight: 20,
    flex: 1,
  },
  menuContainer: {
    backgroundColor: "#fff",
  },

  routeCard: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    elevation: 2,
    marginVertical: 8,
    backgroundColor: "white",
    borderRadius: 10,
  },
  findRouteContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  findRouteButton: {
    backgroundColor: mainColor,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 500,
  },

  routeInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalTime: {
    fontWeight: "bold",
    fontSize: 12,
    color: "white",
    backgroundColor: mainColor,
    padding: 8,
    borderRadius: 20,
  },
  routeCircle: {
    width: 15,
    height: 15,
    borderRadius: 30,
    backgroundColor: mainColor,
    position: "relative",
    top: -5,
    left: -8,
  },
  travelIcon: {
    backgroundColor: mainColor,
    padding: 12,
    minWidth: 50,
    maxWidth: 50,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
  },

  routeInfoContainer: {
    borderBottomColor: "#BDBDBD",
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    gap: 20,
  },
});
