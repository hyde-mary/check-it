import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import DashboardView from "@/components/views/dashboard-view";
import OrdersView from "@/components/views/orders-view";
import AddressesView from "@/components/views/addresses-view";
import { getUserInfo } from "@/utils/sessionManager";
import {
  Address,
  PaymentOption,
  User,
  UserCaloricIntake,
} from "@prisma/client";
import { DotsLoader } from "@/components/Loading";

type UserData = Omit<User, "password"> & {
  paymentOption?: PaymentOption[] | null;
  address?: Address | null;
  caloricIntake?: UserCaloricIntake | null;
};

export default function Dashboard() {
  // const [selected, setSelected] = useState<
  //   "Dashboard" | "Orders" | "Addresses"
  // >("Dashboard");

  const [selected, setSelected] = useState<"Dashboard" | "Orders">("Dashboard");

  const [user, setUser] = useState<UserData | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchUserInfo();
    }, [])
  );

  const fetchUserInfo = async () => {
    try {
      const userId = await getUserInfo();

      if (!userId) {
        throw new Error("Missing user info");
      }

      const response = await fetch("http://10.0.2.2:3000/user/getUserById", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response) {
        throw new Error("Error fetching user from API");
      }

      const user = await response.json();
      setUser(user);
    } catch (error) {
      console.error("Error fetching user info");
    }
  };

  if (!user) return <DotsLoader />;

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
              onPress={() => router.replace("/profile")}
            >
              <Ionicons name="person-circle" size={40} color="white" />
              <View style={styles.profileTextContainer}>
                <Text style={styles.profileName}>
                  {user ? `${user.firstName} ${user.lastName}` : "User"}
                </Text>
                <Text style={styles.profileEmail}>{user.email}</Text>
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

        <View style={styles.tabContainer}>
          {/* {["Dashboard", "Orders", "Addresses"].map((tab) => ( */}
          {["Dashboard", "Orders"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, selected === tab && styles.activeTab]}
              onPress={() =>
                // setSelected(tab as "Dashboard" | "Orders" | "Addresses")
                setSelected(tab as "Dashboard" | "Orders")
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
            <View style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
              <DashboardView userCalories={user.caloricIntake} />
            </View>
          )}
          {selected === "Orders" && (
            <View style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
              <OrdersView />
            </View>
          )}
          {/* {selected === "Addresses" && (
            <View style={{ flex: 1, paddingLeft: 20, paddingRight: 20 }}>
              <AddressesView />
            </View>
          )} */}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { paddingBottom: 40, flexGrow: 1 },
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
  contentContainer: { marginTop: 20, flexGrow: 1 },
});
