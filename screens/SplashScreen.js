import React from "react";
import { View, StyleSheet, Image } from "react-native";

const SplashScreen = () => (
  <View style={styles.container}>
    <Image
      source={require("../img/littleLemonLogo.png")}
      style={styles.logo}
      resizeMode="contain"
      accessible
      accessibilityLabel="Little Lemon Logo"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "90%",
    height: 100,
  },
});

export default SplashScreen;