import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useMemo, useReducer } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

// Screens
import SplashScreen from "./screens/SplashScreen";
import { Onboarding } from "./screens/Onboarding";
import { Profile } from "./screens/Profile";
import { Home } from "./screens/Home";

// Context
import { AuthContext } from "./contexts/AuthContext";

const Stack = createNativeStackNavigator();

export default function App() {
  const [appState, dispatch] = useReducer((prevState, action) => {
    switch (action.type) {
      case "SET_ONBOARDING_STATUS":
        return {
          ...prevState,
          isLoading: false,
          hasCompletedOnboarding: action.payload,
        };
      default:
        return prevState;
    }
  }, {
    isLoading: true,
    hasCompletedOnboarding: false,
  });

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem("profile");
        const profileData = storedProfile ? JSON.parse(storedProfile) : null;

        dispatch({
          type: "SET_ONBOARDING_STATUS",
          payload: profileData !== null,
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        dispatch({ type: "SET_ONBOARDING_STATUS", payload: false });
      }
    };

    checkOnboardingStatus();
  }, []);

  const authContextValue = useMemo(() => ({
    onboard: async (profile) => {
      try {
        await AsyncStorage.setItem("profile", JSON.stringify(profile));
        dispatch({ type: "SET_ONBOARDING_STATUS", payload: true });
      } catch (error) {
        console.error("Onboarding error:", error);
      }
    },
    update: async (profile) => {
      try {
        await AsyncStorage.setItem("profile", JSON.stringify(profile));
        Alert.alert("Success", "Profile updated successfully!");
      } catch (error) {
        console.error("Update error:", error);
      }
    },
    logout: async () => {
      try {
        await AsyncStorage.clear();
        dispatch({ type: "SET_ONBOARDING_STATUS", payload: false });
      } catch (error) {
        console.error("Logout error:", error);
      }
    },
  }), []);

  if (appState.isLoading) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator>
          {appState.hasCompletedOnboarding ? (
            <>
              <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="Profile" component={Profile} />
            </>
          ) : (
            <Stack.Screen
              name="Onboarding"
              component={Onboarding}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
