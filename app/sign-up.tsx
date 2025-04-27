import React, { useState } from "react";
import { Alert, StyleSheet, View, Text } from "react-native";
import { supabase } from "../lib/supabase";
import { Button, Input } from "@rneui/themed";
import { mainColor } from "@/constants/Colors";
import { showErrorToast, showSuccessToast } from "@/utils/toast";
import { useRouter } from "expo-router";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { user },
      error: signUpError,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (signUpError) {
      showErrorToast(
        "Sign up failed, Please check your email and password again!"
      );
      setLoading(false);
      return;
    }

    if (user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          user_id: user.id,
          username: email.split("@")[0],
          avatar_url: null,
        },
      ]);

      if (profileError) {
        showErrorToast("Failed to create profile!");
        setLoading(false);
        return;
      }

      showSuccessToast("Sign up successful!");

      router.push("(tabs)" as any);
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Commufy</Text>
        <Text style={styles.subtitle}>Sign up</Text>
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="Enter your email"
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
          placeholder="Enter your password"
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
          title="Sign up"
          disabled={loading}
          style={{ borderRadius: 50 }}
          onPress={() => signUpWithEmail()}
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
