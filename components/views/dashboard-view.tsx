import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type userCaloriesType = {
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
};

const DashboardView = ({
  userCalories,
}: {
  userCalories: {
    caloricIntake: number;
    carbs: number;
    fat: number;
    protein: number;
    userId: number;
  } | null;
}) => {
  if (!userCalories) return;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Ionicons name="speedometer-outline" size={50} color="#ff6666" />
      <Text style={styles.title}>Welcome to your Dashboard</Text>
      <Text style={styles.subtitle}>
        Here you can view your recent activity, track your progress, and manage
        your account.
      </Text>
      <Text style={styles.dailyIntake}>
        You need this amount of macros for today:
      </Text>
      <View style={styles.macrosContainer}>
        {[
          {
            name: "Calories",
            value: userCalories.caloricIntake.toFixed(2),
            unit: "",
            icon: "fire" as const,
            color: "#ff4500",
          },
          {
            name: "Carbs",
            value: userCalories.carbs.toFixed(2),
            unit: "g",
            icon: "barley" as const,
            color: "#f4a261",
          },
          {
            name: "Fat",
            value: userCalories.fat.toFixed(2),
            unit: "g",
            icon: "water" as const,
            color: "#2a9d8f",
          },
          {
            name: "Protein",
            value: userCalories.protein.toFixed(2),
            unit: "g",
            icon: "food-drumstick" as const,
            color: "#e76f51",
          },
        ].map((macro, index) => (
          <View key={index} style={styles.macroBox}>
            <MaterialCommunityIcons
              name={macro.icon}
              size={24}
              color={macro.color}
            />
            <Text style={styles.macroLabel}>{macro.name}</Text>
            <Text style={styles.macroValue}>
              {macro.value}
              {macro.unit}
            </Text>
          </View>
        ))}
      </View>
      <Text style={styles.sectionTitle}>What These Macros Do</Text>
      <View style={styles.descriptionSection}>
        {[
          {
            title: "Calories",
            description:
              "Provide energy for your daily activities and bodily functions.",
          },
          {
            title: "Carbs",
            description:
              "Your body's primary energy source, essential for brain function and endurance.",
          },
          {
            title: "Fat",
            description:
              "Supports cell growth, hormone production, and nutrient absorption.",
          },
          {
            title: "Protein",
            description:
              "Crucial for muscle repair, immune function, and overall body maintenance.",
          },
        ].map((macro, index) => (
          <View key={index} style={styles.descriptionContainer}>
            <Text style={styles.boldText}>{macro.title}:</Text>
            <Text style={styles.description}>{macro.description}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffebee",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  dailyIntake: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
  },
  macrosContainer: {
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  macroBox: {
    width: "45%",
    padding: 15,
    backgroundColor: "#fff8e1",
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  macroLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  macroValue: {
    fontSize: 18,
    color: "#555",
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 30,
  },
  descriptionSection: {
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  descriptionContainer: {
    width: "90%",
    padding: 15,
    backgroundColor: "#f0f4c3",
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  description: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    marginTop: 5,
  },
  boldText: {
    fontWeight: "bold",
    color: "#222",
  },
});

export default DashboardView;
