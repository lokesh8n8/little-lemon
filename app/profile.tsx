import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { Checkbox } from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { router } from "expo-router";

import { validateEmail } from "../utils";
import { AuthContext } from "../contexts/AuthContext";

export default function ProfileScreen() {
  const { update, logout } = useContext(AuthContext);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    orderStatuses: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false,
    image: "",
  });

  const [discardChanges, setDiscardChanges] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const storedProfile = await AsyncStorage.getItem("profile");
        setProfile(JSON.parse(storedProfile || "{}"));
        setDiscardChanges(false);
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    })();
  }, [discardChanges]);

  const validateName = (name: string) => !(name.length === 0 || /^[a-zA-Z]+$/.test(name));

  const validatePhone = (num: string) => /^\d{10}$/.test(num);

  const updateField = (key: string, value: any) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const isFormValid = () =>
    !validateName(profile.firstName) &&
    !validateName(profile.lastName) &&
    validateEmail(profile.email) &&
    validatePhone(profile.phoneNumber);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      updateField("image", result.assets[0].uri);
    }
  };

  const removeImage = () => updateField("image", "");

  const handleLogout = async () => {
    await logout();
    router.replace("/onboarding" as any);
  };

  // Fonts
  const [fontsLoaded] = useFonts({
    "Karla-Regular": require("../assets/fonts/Karla-Regular.ttf"),
    "Karla-Medium": require("../assets/fonts/Karla-Medium.ttf"),
    "Karla-Bold": require("../assets/fonts/Karla-Bold.ttf"),
    "Karla-ExtraBold": require("../assets/fonts/Karla-ExtraBold.ttf"),
    "MarkaziText-Regular": require("../assets/fonts/MarkaziText-Regular.ttf"),
    "MarkaziText-Medium": require("../assets/fonts/MarkaziText-Medium.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      onLayout={onLayoutRootView}
    >
      <ScrollView style={styles.viewScroll}>
        <Text style={styles.headertext}>Personal Information</Text>

        <Text style={styles.text}>Avatar</Text>
        <View style={styles.avatarContainer}>
          {profile.image ? (
            <Image source={{ uri: profile.image }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarEmpty}>
              <Text style={styles.avatarEmptyText}>
                {profile.firstName[0] || ""}
                {profile.lastName[0] || ""}
              </Text>
            </View>
          )}

          <View style={styles.avatarButtons}>
            <Pressable style={styles.changeBtn} onPress={pickImage}>
              <Text style={styles.saveBtnText}>Change</Text>
            </Pressable>
            <Pressable style={styles.removeBtn} onPress={removeImage}>
              <Text style={styles.discardBtnText}>Remove</Text>
            </Pressable>
          </View>
        </View>

        {[
          { label: "First Name", key: "firstName", isValid: !validateName(profile.firstName) },
          { label: "Last Name", key: "lastName", isValid: !validateName(profile.lastName) },
          { label: "Email", key: "email", isValid: validateEmail(profile.email), keyboard: "email-address" },
          { label: "Phone number (10 digit)", key: "phoneNumber", isValid: validatePhone(profile.phoneNumber), keyboard: "phone-pad" },
        ].map(({ label, key, isValid, keyboard }) => (
          <React.Fragment key={key}>
            <Text style={[styles.text, isValid ? null : styles.error]}>{label}</Text>
            <TextInput
              style={styles.inputBox}
              value={profile[key as keyof typeof profile] as string}
              onChangeText={(value) => updateField(key, value)}
              placeholder={label}
              keyboardType={keyboard as any}
            />
          </React.Fragment>
        ))}

        <Text style={styles.headertext}>Email Notifications</Text>

        {[
          { label: "Order statuses", key: "orderStatuses" },
          { label: "Password changes", key: "passwordChanges" },
          { label: "Special offers", key: "specialOffers" },
          { label: "Newsletter", key: "newsletter" },
        ].map(({ label, key }) => (
          <View style={styles.section} key={key}>
            <Checkbox
              style={styles.checkbox}
              value={profile[key as keyof typeof profile] as boolean}
              onValueChange={(value) => updateField(key, value)}
              color="#495e57"
            />
            <Text style={styles.paragraph}>{label}</Text>
          </View>
        ))}

        <Pressable style={styles.btn} onPress={handleLogout}>
          <Text style={styles.btntext}>Log out</Text>
        </Pressable>

        <View style={styles.buttons}>
          <Pressable style={styles.discardBtn} onPress={() => setDiscardChanges(true)}>
            <Text style={styles.discardBtnText}>Discard changes</Text>
          </Pressable>
          <Pressable
            style={[styles.saveBtn, !isFormValid() && styles.btnDisabled]}
            onPress={() => update(profile)}
            disabled={!isFormValid()}
          >
            <Text style={styles.saveBtnText}>Save changes</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  viewScroll: {
    flex: 1,
    padding: 20,
  },
  headertext: {
    fontSize: 22,
    paddingBottom: 10,
    fontFamily: "Karla-Bold",
    color: "#495e57",
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: "#495e57",
    fontFamily: "Karla-Medium",
  },
  inputBox: {
    alignSelf: "stretch",
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 9,
    borderColor: "#EDEFEE",
    backgroundColor: "#EDEFEE",
    fontFamily: "Karla-Regular",
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarEmpty: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0b9a6a",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmptyText: {
    fontSize: 22,
    color: "#FFFFFF",
    fontFamily: "Karla-Bold",
  },
  avatarButtons: {
    flexDirection: "row",
    marginLeft: 20,
  },
  changeBtn: {
    backgroundColor: "#495e57",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#495e57",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 18,
  },
  removeBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#83918c",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    margin: 8,
  },
  paragraph: {
    fontSize: 15,
    marginLeft: 12,
    fontFamily: "Karla-Medium",
    color: "#495e57",
  },
  checkbox: {
    margin: 8,
  },
  btn: {
    backgroundColor: "#f4ce14",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f4ce14",
    alignSelf: "stretch",
    marginVertical: 18,
    padding: 10,
    alignItems: "center",
  },
  btntext: {
    fontSize: 18,
    color: "#495e57",
    fontFamily: "Karla-Bold",
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 60,
  },
  saveBtn: {
    backgroundColor: "#495e57",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#495e57",
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginHorizontal: 18,
  },
  saveBtnText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "Karla-Bold",
  },
  discardBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#83918c",
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginHorizontal: 18,
  },
  discardBtnText: {
    fontSize: 18,
    color: "#3e524b",
    fontFamily: "Karla-Bold",
  },
  btnDisabled: {
    backgroundColor: "#98a5a0",
  },
  error: {
    color: "#d14747",
    fontWeight: "bold",
  },
});
