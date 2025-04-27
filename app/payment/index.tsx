import RouteFilter, { RouteFilterProps } from "@/components/routes/RouteFilter";
import { mainColor } from "@/constants/Colors";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import SwipeButton from "rn-swipe-button";
import {
  NavigationProp,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useLayoutEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { LatLng } from "react-native-maps";
import { Route } from "../travel";
import { convertSecondIntoMinute } from "@/utils/time";
import { useAuth } from "@/components/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { showErrorToast } from "@/utils/toast";

type OverviewStep = {
  totalTime: string;
  travelMode: string;
};

const availablePaymentMethods = [
  {
    label: "QRIS",
    value: "qris",
  },
  {
    label: "Gopay",
    value: "gopay",
  },
  {
    label: "OVO",
    value: "ovo",
  },
  {
    label: "ShopeePay",
    value: "shopeepay",
  },
  {
    label: "LinkAja",
    value: "linkaja",
  },
  {
    label: "DANA",
    value: "dana",
  },
];

export default function Payment() {
  const params = useGlobalSearchParams();
  const { colors } = useTheme();
  const router = useRouter();

  const { session } = useAuth();

  const routeDetails = JSON.parse(params.routeDetails as string) as Route;
  const filters = JSON.parse(params.filters as string) as RouteFilterProps;
  const overviewSteps = JSON.parse(
    params.overviewSteps as string
  ) as OverviewStep[];
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("qris");
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const completePayment = () => {
    if (session) {
      supabase
        .from("travel_history")
        .insert({
          origin: filters.startLocationName,
          destination: filters.endLocationName,
          departured_at: filters.date,
          user_id: session.user.id,
        })
        .then(({ data, error }) => {
          if (error) {
            showErrorToast("Payment failed. Please try again.");
            return;
          }
          router.replace({
            pathname: "/universal-qr",
            params: {
              routeDetails: JSON.stringify(routeDetails),
            },
          });
        });
    } else {
      router.replace({
        pathname: "/universal-qr",
        params: {
          routeDetails: JSON.stringify(routeDetails),
        },
      });
    }
  };

  return (
    <>
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
        <StatusBar barStyle="light-content" />

        <View style={[styles.topMargin, { backgroundColor: "#007bff" }]} />

        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>MuTix</Text>
        </View>

        <View
          style={{
            paddingHorizontal: 20,
            position: "relative",
            top: -60,
            width: "100%",
          }}
        >
          <View
            style={{
              width: "100%",
              elevation: 2,
              paddingHorizontal: 24,
              paddingVertical: 28,
              borderRadius: 30,
              backgroundColor: "white",
              zIndex: 1,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                Summary
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Distance
                </Text>
                <Text>{routeDetails.localizedValues.distance.text}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Duration
                </Text>
                <Text>{routeDetails.localizedValues.duration.text}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  From
                </Text>
                <Text
                  style={{
                    textAlign: "right",
                    width: "50%",
                  }}
                >
                  {filters.startLocationName}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  To
                </Text>
                <Text
                  style={{
                    textAlign: "right",
                    width: "50%",
                  }}
                >
                  {filters.endLocationName}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Time
                </Text>
                <Text>
                  {filters.time} {filters.date}
                </Text>
              </View>
              <View
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Price
                </Text>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "bold",
                  }}
                >
                  {routeDetails.localizedValues.transitFare.text
                    ? routeDetails.localizedValues.transitFare.text
                    : "Free"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* <View
          style={{
            paddingHorizontal: 20,
            position: "relative",
            top: -40,
            width: "100%",
          }}
        >
          <View
            style={{
              width: "100%",
              elevation: 2,
              paddingHorizontal: 24,
              paddingVertical: 28,
              borderRadius: 30,
              backgroundColor: "white",
              zIndex: 1,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 20,
                }}
              >
                Order
              </Text>
              {overviewSteps.map((step, stepIndex) => (
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
                        backgroundColor: "white",
                      },
                    ]}
                  >
                    <View style={styles.travelIcon}>
                      <FontAwesome5
                        name={step.travelMode === "TRANSIT" ? "bus" : "walking"}
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
                        {convertSecondIntoMinute(parseInt(step.totalTime))}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View> */}

        <View
          style={{
            paddingHorizontal: 20,
            position: "relative",
            top: -20,
            width: "100%",
            marginBottom: 160,
          }}
        >
          <View
            style={{
              width: "100%",
              elevation: 2,
              paddingHorizontal: 24,
              paddingVertical: 28,
              borderRadius: 30,
              backgroundColor: "white",
              zIndex: 1,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 20,
                }}
              >
                Payment Method
              </Text>
            </View>

            {availablePaymentMethods.map((method) => {
              return (
                <TouchableOpacity
                  key={method.value}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 16,
                    borderColor: "#BDBDBD",
                    borderWidth: 1,
                    marginBottom: 10,
                  }}
                  onPress={() => {
                    setSelectedPaymentMethod(method.value);
                  }}
                >
                  <Text>{method.label}</Text>
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor:
                        selectedPaymentMethod === method.value
                          ? mainColor
                          : "#fff",
                      borderWidth: 1,
                      borderColor:
                        selectedPaymentMethod === method.value
                          ? mainColor
                          : "#BDBDBD",
                    }}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          paddingHorizontal: 20,
          paddingVertical: 20,
          backgroundColor: "#fff",
        }}
      >
        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Price
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginRight: 8,
              }}
            >
              {routeDetails.localizedValues.transitFare.text
                ? routeDetails.localizedValues.transitFare.text
                : "Free"}
            </Text>

            <TouchableOpacity
              onPress={() => {
                setShowDetails(!showDetails);
              }}
            >
              <FontAwesome5 name="chevron-up" size={16} />
            </TouchableOpacity>
          </View>
        </View>
        {showDetails && (
          <>
            <View
              style={{
                marginBottom: 20,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>Price</Text>
              <Text>
                {routeDetails.localizedValues.transitFare.text
                  ? routeDetails.localizedValues.transitFare.text
                  : "Free"}
              </Text>
            </View>
            {!routeDetails.localizedValues.transitFare.text && (
              <View
                style={{
                  marginBottom: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>Admin</Text>
                <Text>Rp. 2000</Text>
              </View>
            )}
          </>
        )}
        <SwipeButton
          title="Swipe to pay"
          onSwipeSuccess={() => {
            completePayment();
          }}
          railBorderColor="white"
          railBackgroundColor={mainColor}
          titleColor="white"
          thumbIconBackgroundColor="white"
          railFillBackgroundColor="white"
        />
      </View>
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
