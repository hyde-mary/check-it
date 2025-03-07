import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRegisterStore } from "@/store/useRegisterStore";

export default function ActivityLevel() {
  const [selectedActivity, setSelectedActivity] = useState("");
  const updateUserData = useRegisterStore((state) => state.updateUserData);
  const activities: {
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    {
      title: "Sedentary",
      description: "Little or no exercise",
      icon: "bed-outline",
    },
    {
      title: "Lightly Active",
      description: "Light exercise 1-3 days/week",
      icon: "walk-outline",
    },
    {
      title: "Highly Active",
      description: "Intense exercise 6-7 days/week",
      icon: "barbell-outline",
    },
  ];

  const handleSubmit = async () => {
    if (!selectedActivity) {
      return Alert.alert("Error", "Please select your activity level.");
    }

    const formattedActivity = selectedActivity.replace(/\s+/g, "");

    updateUserData({ activityLevel: formattedActivity });
    router.push("/user-goals");
  };

  return (
    <LinearGradient colors={["#ffe6e6", "#ff9999"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Ionicons name="fitness-outline" size={48} color="#6B7280" />
          <Text style={styles.title}>Activity Level</Text>
          <Text style={styles.subtitle}>How active are you daily?</Text>
        </View>

        <View style={styles.formContainer}>
          {activities.map((activity) => (
            <TouchableOpacity
              key={activity.title}
              style={[
                styles.optionCard,
                selectedActivity === activity.title && styles.selectedCard,
              ]}
              onPress={() => setSelectedActivity(activity.title)}
            >
              <Ionicons
                name={activity.icon}
                size={28}
                color={
                  selectedActivity === activity.title ? "white" : "#ff9999"
                }
                style={styles.activityIcon}
              />
              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.optionTitle,
                    selectedActivity === activity.title && styles.selectedText,
                  ]}
                >
                  {activity.title}
                </Text>
                <Text
                  style={[
                    styles.optionDescription,
                    selectedActivity === activity.title && styles.selectedText,
                  ]}
                >
                  {activity.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.button, !selectedActivity && styles.disabledButton]}
            disabled={!selectedActivity}
          >
            <Text style={styles.buttonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
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
  optionCard: {
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
  activityIcon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  optionDescription: {
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
