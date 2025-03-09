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
import { useRegisterStore } from "@/store/useRegisterStore";
import { saveToken, saveUserInfo } from "@/utils/sessionManager";

export default function UserGoals() {
  const [selectedGoal, setSelectedGoal] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (!selectedGoal) {
      Alert.alert("Error", "Please select a goal before proceeding.");
      return;
    }

    const formattedGoals = selectedGoal.replace(/\s+/g, "");

    const { updateUserData, resetUserData, getUserData } =
      useRegisterStore.getState();

    updateUserData({ goals: formattedGoals });

    try {
      setLoading(true);

      const latestUserData = getUserData();

      const response = await fetch("http://10.0.2.2:3000/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(latestUserData),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.error || "Something went wrong.");
      }

      // haba HAHA
      await saveToken(data.token);
      await saveUserInfo(data.userId);
      resetUserData();
      Alert.alert("Success", "User registered successfully!");
      router.replace("/");
    } catch (error) {
      console.error("Error registering user:", error);
      Alert.alert("Error", "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
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
            style={[
              styles.button,
              (!selectedGoal || loading) && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={!selectedGoal || loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Registering..." : "Complete Registration"}
            </Text>
            {!loading && (
              <Ionicons name="checkmark-circle" size={20} color="white" />
            )}
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
