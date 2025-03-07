import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

export default function LandingPage() {
  return (
    <SafeAreaView style={styles.container}>
      <Svg style={[StyleSheet.absoluteFill, styles.svgBackground]}>
        <Circle cx="90%" cy="-10%" r={120} fill={Colors.primary} />
        <Circle cx="10%" cy="30%" r={80} fill={Colors.primary} />
        <Path
          d="M0 150 Q 150 100 300 150 T 600 150 L 600 400 L 0 400 Z"
          fill={Colors.primary}
        />
      </Svg>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to</Text>
          <Text style={styles.appName}>Check It</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="restaurant-outline"
              size={80}
              color={"#0e0e0e"}
              style={styles.icon}
            />
            <View style={styles.circleEffect} />
          </View>

          <Text style={[styles.subtitle]}>
            Smart Meals, Perfect Nutrition—AI-Powered Dining Just for You!
          </Text>

          <View style={styles.features}>
            <View style={styles.featureItem}>
              <Ionicons
                name="nutrition-outline"
                size={32}
                color={Colors.primary}
              />
              <Text style={styles.featureText}>
                AI-Powered Meal Recommendations
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons
                name="analytics-outline"
                size={32}
                color={Colors.primary}
              />
              <Text style={styles.featureText}>
                Real-Time Nutrition Tracking
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons
                name="navigate-outline"
                size={32}
                color={Colors.primary}
              />
              <Text style={styles.featureText}>Smart Delivery Routing</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Link href="/login" asChild>
            <TouchableOpacity
              style={[styles.button, styles.loginButton]}
              accessibilityLabel="Navigate to login screen"
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </Link>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>New here?</Text>
            <Link href="/register" asChild>
              <TouchableOpacity>
                <Text style={styles.registerLink}> Create Account</Text>
              </TouchableOpacity>
            </Link>
            <Text style={styles.registerText}> or</Text>
            <Link href="/login" asChild>
              <Text style={styles.registerLink}> Login</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  svgBackground: {
    opacity: 0.4,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginTop: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    color: Colors.light.text,
    fontWeight: "300",
  },
  appName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#0e0e0e",
    marginTop: 8,
  },
  content: {
    marginTop: 40,
    alignItems: "center",
  },
  iconContainer: {
    position: "relative",
    marginBottom: 24,
  },
  icon: {
    zIndex: 2,
  },
  circleEffect: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary + "20",
    top: -20,
    left: -20,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.light.text,
    textAlign: "center",
    lineHeight: 28,
    marginHorizontal: 20,
  },
  darkSubtitle: {
    color: Colors.light.text,
  },
  features: {
    marginTop: 40,
    width: "100%",
    gap: 24,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    padding: 16,
    borderRadius: 12,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureText: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: "500",
    flex: 1,
  },
  footer: {
    marginTop: 40,
    width: "100%",
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: {
    color: Colors.light.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  registerText: {
    color: Colors.light.text,
    fontSize: 16,
  },
  registerLink: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
});
