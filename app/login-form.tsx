import React, { useState } from "react";
import { Alert, StyleSheet, View, Text } from "react-native";
import { supabase } from "../lib/supabase";
import { Button, Input } from "@rneui/themed";
import { mainColor } from "@/constants/Colors";
import { showErrorToast } from "@/utils/toast";
import { useRouter } from "expo-router";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      showErrorToast(
        "Sign in failed, Please check your email and password again!"
      );
      return;
    }

    router.push("(tabs)" as any);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Commufy</Text>
        <Text style={styles.subtitle}>Sign in</Text>
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>

      <View
        style={[
          styles.verticallySpaced,
          {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            marginBottom: 20,
            marginHorizontal: 20,
            borderRadius: 30,
          },
        ]}
      >
        <Button
          title="Sign in"
          disabled={loading}
          style={{ borderRadius: 50 }}
          onPress={() => signInWithEmail()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "white",
    height: "100%",
    paddingTop: 50,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: mainColor,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 25,
    color: "black",
    marginBottom: 20,
    fontWeight: "bold",
  },
});
