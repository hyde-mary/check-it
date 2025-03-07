import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const sampleAddresses: Array<{
  id: number;
  label: string;
  address: string;
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  {
    id: 1,
    label: "Home",
    address: "123 Main St, Makati City, Philippines",
    icon: "home",
  },
  {
    id: 2,
    label: "Work",
    address: "456 Business Rd, Makati City, Philippines",
    icon: "briefcase",
  },
  {
    id: 3,
    label: "Other",
    address: "789 Apartment Ln, Makati City, Philippines",
    icon: "location",
  },
];

const AddressesView = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Addresses</Text>
      {sampleAddresses.map((item) => (
        <View key={item.id} style={styles.addressBox}>
          <Ionicons name={item.icon} size={24} color="#ff6666" />
          <View style={styles.textContainer}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.address}>{item.address}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffebee",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  addressBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
  },
  textContainer: {
    marginLeft: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff6666",
  },
  address: {
    fontSize: 14,
    color: "#555",
  },
});

export default AddressesView;
