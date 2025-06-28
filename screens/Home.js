import { useEffect, useState, useCallback, useMemo } from "react";
import { Text, View, StyleSheet, SectionList, Alert, Image, Pressable } from "react-native";
import { Searchbar } from "react-native-paper";
import debounce from "lodash.debounce";
import { createTable, getMenuItems, filterByQueryAndCategories } from "../database";
import Filters from "../components/Filters";
import { getSectionListData, useUpdateEffect } from "../utils/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const SECTIONS = ["starters", "mains", "desserts"];

// Menu item component
const MenuItem = ({ name, price, description, image }) => (
  <View style={styles.item}>
    <View style={styles.itemBody}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.price}>${price}</Text>
    </View>
    <Image
      style={styles.itemImage}
      source={{
        uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${image}?raw=true`,
      }}
    />
  </View>
);

export const Home = ({ navigation }) => {
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

  const [menuSections, setMenuSections] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState(SECTIONS.map(() => false));

  // Initial setup: Load menu and profile
  useEffect(() => {
    (async () => {
      try {
        await createTable();
        const items = await getMenuItems();
        setMenuSections(getSectionListData(items));

        const storedProfile = await AsyncStorage.getItem("profile");
        if (storedProfile) setProfile(JSON.parse(storedProfile));
      } catch (err) {
        Alert.alert("Error", err.message);
      }
    })();
  }, []);

  // Filters or search updated
  useUpdateEffect(() => {
    (async () => {
      const activeCategories = SECTIONS.filter((_, index) =>
        selectedFilters.every((v) => v === false) ? true : selectedFilters[index]
      );
      try {
        const filteredItems = await filterByQueryAndCategories(query, activeCategories);
        setMenuSections(getSectionListData(filteredItems));
      } catch (err) {
        Alert.alert("Error", err.message);
      }
    })();
  }, [selectedFilters, query]);

  // Debounced search handler
  const handleQueryUpdate = useCallback((text) => setQuery(text), []);
  const debouncedSearch = useMemo(() => debounce(handleQueryUpdate, 1000), [handleQueryUpdate]);

  const onSearchChange = (text) => {
    setSearchText(text);
    debouncedSearch(text);
  };

  const toggleFilter = (index) => {
    const updated = [...selectedFilters];
    updated[index] = !selectedFilters[index];
    setSelectedFilters(updated);
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

  const onFontsReady = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container} onLayout={onFontsReady}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={require("../img/littleLemonLogo.png")}
          accessible
          accessibilityLabel="Little Lemon Logo"
        />
        <Pressable style={styles.avatar} onPress={() => navigation.navigate("Profile")}>
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
        </Pressable>
      </View>

      <View style={styles.heroSection}>
        <Text style={styles.heroHeader}>Little Lemon</Text>
        <View style={styles.heroBody}>
          <View style={styles.heroContent}>
            <Text style={styles.heroHeader2}>Chicago</Text>
            <Text style={styles.heroText}>
              We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
            </Text>
          </View>
          <Image
            style={styles.heroImage}
            source={require("../img/restauranfood.png")}
            accessible
            accessibilityLabel="Little Lemon Food"
          />
        </View>
        <Searchbar
          placeholder="Search"
          placeholderTextColor="#333333"
          onChangeText={onSearchChange}
          value={searchText}
          style={styles.searchBar}
          iconColor="#333333"
          inputStyle={{ color: "#333333" }}
          elevation={0}
        />
      </View>

      <Text style={styles.delivery}>ORDER FOR DELIVERY!</Text>
      <Filters
        selections={selectedFilters}
        onChange={toggleFilter}
        sections={SECTIONS}
      />

      <SectionList
        style={styles.sectionList}
        sections={menuSections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MenuItem
            name={item.name}
            price={item.price}
            description={item.description}
            image={item.image}
          />
        )}
        renderSectionHeader={({ section: { name } }) => (
          <Text style={styles.itemHeader}>{name}</Text>
        )}
      />
    </View>
  );
};

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
  avatar: {
    flex: 1,
    position: "absolute",
    right: 10,
    top: 10,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarEmpty: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#0b9a6a",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmptyText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Karla-Bold",
  },
  heroSection: {
    backgroundColor: "#495e57",
    padding: 15,
  },
  heroHeader: {
    color: "#f4ce14",
    fontSize: 54,
    fontFamily: "MarkaziText-Medium",
  },
  heroHeader2: {
    color: "#fff",
    fontSize: 30,
    fontFamily: "MarkaziText-Medium",
  },
  heroText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Karla-Medium",
  },
  heroBody: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heroContent: {
    flex: 1,
  },
  heroImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  searchBar: {
    marginTop: 15,
    backgroundColor: "#e4e4e4",
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  delivery: {
    fontSize: 18,
    padding: 15,
    fontFamily: "Karla-ExtraBold",
  },
  sectionList: {
    paddingHorizontal: 16,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
    paddingVertical: 10,
  },
  itemBody: {
    flex: 1,
  },
  itemHeader: {
    fontSize: 24,
    paddingVertical: 8,
    color: "#495e57",
    backgroundColor: "#fff",
    fontFamily: "Karla-ExtraBold",
  },
  name: {
    fontSize: 20,
    color: "#000000",
    paddingBottom: 5,
    fontFamily: "Karla-Bold",
  },
  description: {
    color: "#495e57",
    paddingRight: 5,
    fontFamily: "Karla-Medium",
  },
  price: {
    fontSize: 20,
    color: "#EE9972",
    paddingTop: 5,
    fontFamily: "Karla-Medium",
  },
  itemImage: {
    width: 100,
    height: 100,
  },
});