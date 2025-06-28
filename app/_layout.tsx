import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useReducer } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthContext } from '../contexts/AuthContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [appState, dispatch] = useReducer((prevState: any, action: any) => {
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
    onboard: async (profile: any) => {
      try {
        await AsyncStorage.setItem("profile", JSON.stringify(profile));
        dispatch({ type: "SET_ONBOARDING_STATUS", payload: true });
      } catch (error) {
        console.error("Onboarding error:", error);
      }
    },
    update: async (profile: any) => {
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

  if (!loaded) {
    return null;
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          {appState.hasCompletedOnboarding ? (
            <>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="profile" options={{ title: "Profile" }} />
            </>
          ) : (
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          )}
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthContext.Provider>
  );
}
