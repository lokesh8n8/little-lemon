import React, { useState, useRef, useContext, useCallback } from "react";
import { View, Image, StyleSheet, Text, KeyboardAvoidingView, Platform, TextInput, Pressable } from "react-native";
import PagerView from "react-native-pager-view";
import Constants from "expo-constants";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { router } from "expo-router";

import { validateEmail, validateName } from "../utils";
import { AuthContext } from "../contexts/AuthContext";

export default function OnboardingScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const isFirstNameValid = validateName(firstName);
  const isLastNameValid = validateName(lastName);
  const isEmailValid = validateEmail(email);

  const pagerRef = useRef<PagerView>(null);
  const { onboard } = useContext(AuthContext);

  const [fontsLoaded] = useFonts({
    "Karla-Regular": require("../assets/fonts/Karla-Regular.ttf"),
    "Karla-Medium": require("../assets/fonts/Karla-Medium.ttf"),
    "Karla-Bold": require("../assets/fonts/Karla-Bold.ttf"),
    "Karla-ExtraBold": require("../assets/fonts/Karla-ExtraBold.ttf"),
    "MarkaziText-Regular": require("../assets/fonts/MarkaziText-Regular.ttf"),
    "MarkaziText-Medium": require("../assets/fonts/MarkaziText-Medium.ttf"),
  });

  const handleLayout = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  const handleOnboard = async () => {
    await onboard({ firstName, lastName, email });
    router.replace("/(tabs)");
  };

  if (!fontsLoaded) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      onLayout={handleLayout}
    >
      <View style={styles.header}>
        <Image
          source={require("../assets/images/icon.png")}
          style={styles.logo}
          accessible
          accessibilityLabel="Little Lemon Logo"
        />
      </View>

      <Text style={styles.welcomeText}>Let us get to know you</Text>

      <PagerView
        style={styles.viewPager}
        scrollEnabled={false}
        initialPage={0}
        ref={pagerRef}
      >
        {/* Page 1: First Name */}
        <View key="1" style={styles.page}>
          <View style={styles.pageContainer}>
            <Text style={styles.text}>First Name</Text>
            <TextInput
              style={styles.inputBox}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First Name"
            />
          </View>
          <View style={styles.pageIndicator}>
            <View style={[styles.pageDot, styles.pageDotActive]} />
            <View style={styles.pageDot} />
            <View style={styles.pageDot} />
          </View>
          <Pressable
            style={[styles.btn, !isFirstNameValid && styles.btnDisabled]}
            onPress={() => pagerRef.current?.setPage(1)}
            disabled={!isFirstNameValid}
          >
            <Text style={styles.btntext}>Next</Text>
          </Pressable>
        </View>

        {/* Page 2: Last Name */}
        <View key="2" style={styles.page}>
          <View style={styles.pageContainer}>
            <Text style={styles.text}>Last Name</Text>
            <TextInput
              style={styles.inputBox}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last Name"
            />
          </View>
          <View style={styles.pageIndicator}>
            <View style={styles.pageDot} />
            <View style={[styles.pageDot, styles.pageDotActive]} />
            <View style={styles.pageDot} />
          </View>
          <View style={styles.buttons}>
            <Pressable
              style={styles.halfBtn}
              onPress={() => pagerRef.current?.setPage(0)}
            >
              <Text style={styles.btntext}>Back</Text>
            </Pressable>
            <Pressable
              style={[styles.halfBtn, !isLastNameValid && styles.btnDisabled]}
              onPress={() => pagerRef.current?.setPage(2)}
              disabled={!isLastNameValid}
            >
              <Text style={styles.btntext}>Next</Text>
            </Pressable>
          </View>
        </View>

        {/* Page 3: Email */}
        <View key="3" style={styles.page}>
          <View style={styles.pageContainer}>
            <Text style={styles.text}>Email</Text>
            <TextInput
              style={styles.inputBox}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.pageIndicator}>
            <View style={styles.pageDot} />
            <View style={styles.pageDot} />
            <View style={[styles.pageDot, styles.pageDotActive]} />
          </View>
          <View style={styles.buttons}>
            <Pressable
              style={styles.halfBtn}
              onPress={() => pagerRef.current?.setPage(1)}
            >
              <Text style={styles.btntext}>Back</Text>
            </Pressable>
            <Pressable
              style={[styles.halfBtn, !isEmailValid && styles.btnDisabled]}
              onPress={handleOnboard}
              disabled={!isEmailValid}
            >
              <Text style={styles.btntext}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </PagerView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Constants.statusBarHeight,
  },
  header: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#dee3e9",
  },
  logo: {
    height: 50,
    width: 150,
    resizeMode: "contain",
  },
  welcomeText: {
    fontSize: 20,
    textAlign: "center",
    margin: 20,
    color: "#495e57",
    fontFamily: "Karla-Bold",
  },
  viewPager: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  pageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  text: {
    fontSize: 24,
    marginBottom: 10,
    color: "#495e57",
    fontFamily: "Karla-Medium",
  },
  inputBox: {
    alignSelf: "stretch",
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
    fontSize: 20,
    borderRadius: 9,
    borderColor: "#EDEFEE",
    backgroundColor: "#EDEFEE",
    fontFamily: "Karla-Regular",
  },
  pageIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  pageDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#EDEFEE",
    marginHorizontal: 5,
  },
  pageDotActive: {
    backgroundColor: "#495e57",
  },
  btn: {
    backgroundColor: "#f4ce14",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f4ce14",
    alignSelf: "stretch",
    padding: 10,
    alignItems: "center",
  },
  halfBtn: {
    backgroundColor: "#f4ce14",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f4ce14",
    flex: 0.48,
    padding: 10,
    alignItems: "center",
  },
  btnDisabled: {
    backgroundColor: "#98a5a0",
  },
  btntext: {
    fontSize: 18,
    color: "#495e57",
    fontFamily: "Karla-Bold",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "stretch",
  },
});
