import { Image } from 'expo-image';
import { StyleSheet, Pressable, ScrollView, View, Text } from 'react-native';
import { router } from 'expo-router';
import { useFonts } from 'expo-font';
import { useCallback, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import Constants from 'expo-constants';

export default function HomeScreen() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    image: null as string | null,
  });

  const [fontsLoaded] = useFonts({
    "Karla-Regular": require("../../assets/fonts/Karla-Regular.ttf"),
    "Karla-Medium": require("../../assets/fonts/Karla-Medium.ttf"),
    "Karla-Bold": require("../../assets/fonts/Karla-Bold.ttf"),
    "Karla-ExtraBold": require("../../assets/fonts/Karla-ExtraBold.ttf"),
    "MarkaziText-Regular": require("../../assets/fonts/MarkaziText-Regular.ttf"),
    "MarkaziText-Medium": require("../../assets/fonts/MarkaziText-Medium.ttf"),
  });

  useEffect(() => {
    (async () => {
      try {
        const storedProfile = await AsyncStorage.getItem("profile");
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    })();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView style={styles.container} onLayout={onLayoutRootView}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.logo}
          accessible
          accessibilityLabel="Little Lemon Logo"
        />
        <Pressable style={styles.avatar} onPress={() => router.push('/profile' as any)}>
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

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Little Lemon</Text>
        <View style={styles.heroContent}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroSubtitle}>Chicago</Text>
            <Text style={styles.heroDescription}>
              We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
            </Text>
            <Pressable 
              style={styles.reserveButton}
              onPress={() => router.push('/(tabs)/menu' as any)}
            >
              <Text style={styles.reserveButtonText}>Reserve a Table</Text>
            </Pressable>
          </View>
          <Image
            source={require("../../assets/images/react-logo.png")}
            style={styles.heroImage}
            accessible
            accessibilityLabel="Delicious Food"
          />
        </View>
      </View>

      {/* Quick Actions Section */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>ORDER FOR DELIVERY!</Text>
        
        <View style={styles.quickActions}>
          <Pressable 
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/menu' as any)}
          >
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>🍽️</Text>
            </View>
            <Text style={styles.actionTitle}>View Menu</Text>
            <Text style={styles.actionSubtitle}>Browse our delicious dishes</Text>
          </Pressable>

          <Pressable 
            style={styles.actionCard}
            onPress={() => router.push('/profile' as any)}
          >
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>👤</Text>
            </View>
            <Text style={styles.actionTitle}>My Profile</Text>
            <Text style={styles.actionSubtitle}>Manage your account</Text>
          </Pressable>
        </View>
      </View>

      {/* Featured Items Section */}
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Today&apos;s Specials</Text>
        
        <View style={styles.featuredItems}>
          <View style={styles.featuredItem}>
            <View style={styles.featuredImagePlaceholder}>
              <Text style={styles.featuredImageText}>🥗</Text>
            </View>
            <View style={styles.featuredContent}>
              <Text style={styles.featuredTitle}>Greek Salad</Text>
              <Text style={styles.featuredDescription}>Fresh lettuce, peppers, olives and feta cheese</Text>
              <Text style={styles.featuredPrice}>$12.99</Text>
            </View>
          </View>

          <View style={styles.featuredItem}>
            <View style={styles.featuredImagePlaceholder}>
              <Text style={styles.featuredImageText}>🍝</Text>
            </View>
            <View style={styles.featuredContent}>
              <Text style={styles.featuredTitle}>Mediterranean Pasta</Text>
              <Text style={styles.featuredDescription}>Penne with aubergines and fresh herbs</Text>
              <Text style={styles.featuredPrice}>$18.99</Text>
            </View>
          </View>

          <View style={styles.featuredItem}>
            <View style={styles.featuredImagePlaceholder}>
              <Text style={styles.featuredImageText}>🍰</Text>
            </View>
            <View style={styles.featuredContent}>
              <Text style={styles.featuredTitle}>Lemon Dessert</Text>
              <Text style={styles.featuredDescription}>Traditional Italian Lemon Ricotta Cake</Text>
              <Text style={styles.featuredPrice}>$8.50</Text>
            </View>
          </View>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.aboutSection}>
        <Text style={styles.sectionTitle}>About Little Lemon</Text>
        <Text style={styles.aboutText}>
          Our chef draws inspiration from Italian, Greek, and Turkish culture and has a unique menu for you to discover. 
          We pride ourselves on serving traditional recipes with a modern twist, using only the freshest ingredients.
        </Text>
        
        <View style={styles.contactInfo}>
          <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>📍</Text>
            <Text style={styles.contactText}>123 Main Street, Chicago, IL</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>📞</Text>
            <Text style={styles.contactText}>(555) 123-4567</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>🕒</Text>
            <Text style={styles.contactText}>Open Daily: 11:00 AM - 10:00 PM</Text>
          </View>
        </View>
      </View>

      {/* Testimonials Section */}
      <View style={styles.testimonialsSection}>
        <Text style={styles.sectionTitle}>What Our Guests Say</Text>
        
        <View style={styles.testimonials}>
          <View style={styles.testimonialCard}>
            <View style={styles.starsContainer}>
              <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
            </View>
            <Text style={styles.testimonialText}>
              &quot;Amazing Mediterranean food! The Greek salad was fresh and the pasta was incredible. Will definitely be back!&quot;
            </Text>
            <Text style={styles.testimonialAuthor}>- Sarah M.</Text>
          </View>

          <View style={styles.testimonialCard}>
            <View style={styles.starsContainer}>
              <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
            </View>
            <Text style={styles.testimonialText}>
              &quot;Perfect atmosphere for a date night. The lemon dessert was to die for. Highly recommend!&quot;
            </Text>
            <Text style={styles.testimonialAuthor}>- Mike &amp; Lisa</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Header Section Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Constants.statusBarHeight + 10,
    paddingBottom: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 180,
    height: 40,
    resizeMode: 'contain',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarEmpty: {
    width: '100%',
    height: '100%',
    backgroundColor: '#495e57',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmptyText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Karla-Bold',
  },
  // Hero Section Styles
  heroSection: {
    backgroundColor: '#495e57',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  heroTitle: {
    fontSize: 48,
    fontFamily: 'MarkaziText-Medium',
    color: '#f4ce14',
    marginBottom: 5,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  heroLeft: {
    flex: 1,
  },
  heroSubtitle: {
    fontSize: 32,
    fontFamily: 'MarkaziText-Regular',
    color: '#fff',
    marginBottom: 15,
  },
  heroDescription: {
    fontSize: 16,
    fontFamily: 'Karla-Regular',
    color: '#fff',
    lineHeight: 24,
    marginBottom: 20,
  },
  reserveButton: {
    backgroundColor: '#f4ce14',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  reserveButtonText: {
    fontSize: 16,
    fontFamily: 'Karla-Bold',
    color: '#495e57',
  },
  heroImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  // Quick Actions Section Styles
  quickActionsSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#f8f9fa',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Karla-ExtraBold',
    color: '#333',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 15,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f4ce14',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 28,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Karla-Bold',
    color: '#333',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    fontFamily: 'Karla-Regular',
    color: '#666',
    textAlign: 'center',
  },
  // Featured Items Section Styles
  featuredSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  featuredItems: {
    gap: 15,
  },
  featuredItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#f4ce14',
  },
  featuredImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featuredImageText: {
    fontSize: 32,
  },
  featuredContent: {
    flex: 1,
    justifyContent: 'center',
  },
  featuredTitle: {
    fontSize: 18,
    fontFamily: 'Karla-Bold',
    color: '#333',
    marginBottom: 4,
  },
  featuredDescription: {
    fontSize: 14,
    fontFamily: 'Karla-Regular',
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  featuredPrice: {
    fontSize: 16,
    fontFamily: 'Karla-Bold',
    color: '#495e57',
  },
  // About Section Styles
  aboutSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#f8f9fa',
  },
  aboutText: {
    fontSize: 16,
    fontFamily: 'Karla-Regular',
    color: '#333',
    lineHeight: 24,
    marginBottom: 25,
  },
  contactInfo: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactIcon: {
    fontSize: 20,
    width: 24,
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Karla-Regular',
    color: '#666',
    flex: 1,
  },
  // Testimonials Section Styles
  testimonialsSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  testimonials: {
    gap: 15,
    flexDirection: 'row',
  },
  testimonialCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  starsContainer: {
    marginBottom: 12,
  },
  stars: {
    fontSize: 16,
  },
  testimonialText: {
    fontSize: 14,
    fontFamily: 'Karla-Regular',
    color: '#333',
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  testimonialAuthor: {
    fontSize: 12,
    fontFamily: 'Karla-Bold',
    color: '#495e57',
  },
});
