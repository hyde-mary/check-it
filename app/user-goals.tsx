import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function UserGoals() {
  const [selectedGoal, setSelectedGoal] = useState("");

  const goals: {
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    {
      title: "Lose Weight",
      icon: "trending-down",
      description: "Burn fat and reduce body weight",
    },
    {
      title: "Maintain Weight",
      icon: "barbell-outline",
      description: "Keep current weight with balanced nutrition",
    },
    {
      title: "Gain Weight",
      icon: "trending-up",
      description: "Build muscle mass and increase calorie intake",
    },
  ];

  const handleSubmit = async () => {
    // if (!selectedGoal) {
    //   Alert.alert("Error", "Please select a goal before proceeding.");
    //   return;
    // }
    // try {
    //   const response = await fetch(`${BASE_URL}/api.php?table=users`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       ...userData,
    //       goals: selectedGoal,
    //     }),
    //   });
    //   if (response.ok) {
    //     const responseText = await response.text();
    //     console.log(responseText);
    //     const responseData = JSON.parse(responseText);
    //     if (responseData) {
    //       await login(responseData.user);
    //       Alert.alert("Success", "Registration completed!", [
    //         { text: "OK", onPress: () => router.push("/") },
    //       ]);
    //     } else {
    //       Alert.alert("Something went wrong, contact the admins!");
    //     }
    //   }
    // } catch (error) {
    //   console.error("API Error [userGoals.tsx]:", error);
    //   Alert.alert("Error", "Something went wrong. Please try again.");
    // }
  };

  return (
    <LinearGradient colors={["#ffe6e6", "#ff9999"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Ionicons name="ribbon-outline" size={48} color="#6B7280" />
          <Text style={styles.title}>Your Fitness Goal</Text>
          <Text style={styles.subtitle}>What's your primary objective?</Text>
        </View>

        <View style={styles.formContainer}>
          {goals.map((goal) => (
            <TouchableOpacity
              key={goal.title}
              style={[
                styles.goalCard,
                selectedGoal === goal.title && styles.selectedCard,
              ]}
              onPress={() => setSelectedGoal(goal.title)}
            >
              <Ionicons
                name={goal.icon}
                size={28}
                color={selectedGoal === goal.title ? "white" : "#ff9999"}
                style={styles.goalIcon}
              />
              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.goalTitle,
                    selectedGoal === goal.title && styles.selectedText,
                  ]}
                >
                  {goal.title}
                </Text>
                <Text
                  style={[
                    styles.goalDescription,
                    selectedGoal === goal.title && styles.selectedText,
                  ]}
                >
                  {goal.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.button, !selectedGoal && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={!selectedGoal}
          >
            <Text style={styles.buttonText}>Complete Registration</Text>
            <Ionicons name="checkmark-circle" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6B7280",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 8,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  goalCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff0f0",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#fff0f0",
  },
  selectedCard: {
    backgroundColor: "#ff9999",
    borderColor: "#ff6666",
  },
  goalIcon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
  selectedText: {
    color: "white",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff9999",
    height: 50,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
