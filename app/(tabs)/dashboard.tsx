import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import DashboardView from "@/components/views/dashboard-view";
import OrdersView from "@/components/views/orders-view";
import AddressesView from "@/components/views/addresses-view";

export default function TabTwoScreen() {
  const [selected, setSelected] = useState<
    "Dashboard" | "Orders" | "Addresses"
  >("Dashboard");
  const [userCalories, setUserCalories] = useState<{
    caloricIntake: number;
    carbs: number;
    fat: number;
    protein: number;
    userId: number;
  } | null>(null);

  useEffect(() => {
    fetchUserCalories(2);
  }, []);

  const fetchUserCalories = async (userId: Number) => {
    try {
      const response = await fetch(
        "http://10.0.2.2:3000/calories/userCalories",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await response.json();
      setUserCalories(data);
    } catch (error) {
      console.error("Error fetching user calories:", error);
    }
  };

  return (
    <LinearGradient colors={["#ffe6e6", "#ff9999"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Header */}
        <View style={styles.profileCard}>
          <LinearGradient
            colors={["#ff9999", "#ff6666"]}
            style={styles.profileGradient}
          >
            <TouchableOpacity
              style={styles.profileHeader}
              onPress={() => router.push("/profile")}
            >
              <Ionicons name="person-circle" size={40} color="white" />
              <View style={styles.profileTextContainer}>
                {/* <Text style={styles.profileName}>
                  {userData
                    ? `${userData.first_name} ${userData.last_name}`
                    : "User"}
                </Text>
                <Text style={styles.profileEmail}>{user?.email}</Text> */}
              </View>
              <Ionicons
                name="chevron-forward"
                size={24}
                color="white"
                style={styles.profileArrow}
              />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {["Dashboard", "Orders", "Addresses"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, selected === tab && styles.activeTab]}
              onPress={() =>
                setSelected(tab as "Dashboard" | "Orders" | "Addresses")
              }
            >
              <Ionicons
                name={
                  tab === "Dashboard"
                    ? "grid"
                    : tab === "Orders"
                    ? "cart"
                    : "location"
                }
                size={20}
                color={selected === tab ? "#ff9999" : "#6B7280"}
              />
              <Text
                style={[
                  styles.tabText,
                  selected === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.contentContainer}>
          {selected === "Dashboard" && (
            <DashboardView userCalories={userCalories} />
          )}
          {selected === "Orders" && <OrdersView />}
          {selected === "Addresses" && <AddressesView />}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { paddingBottom: 40 },
  profileCard: {
    marginHorizontal: 20,
    marginTop: 40,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  profileGradient: { padding: 20 },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileTextContainer: { marginLeft: 15, flex: 1 },
  profileName: { color: "white", fontSize: 20, fontWeight: "bold" },
  profileEmail: { color: "rgba(255,255,255,0.8)", fontSize: 14 },
  profileArrow: { marginLeft: 10 },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 8,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeTab: { backgroundColor: "#fff0f0" },
  tabText: { color: "#6B7280", fontWeight: "500", marginLeft: 5 },
  activeTabText: { color: "#ff9999", fontWeight: "600" },
  contentContainer: { marginTop: 20 },
});
