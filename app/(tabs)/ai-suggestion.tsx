import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getUserInfo } from "@/utils/sessionManager";
import {
  Address,
  PaymentOption,
  User,
  UserCaloricIntake,
} from "@prisma/client";
import { DotsLoader } from "@/components/Loading";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { useRouter } from "expo-router";

type UserData = Omit<User, "password"> & {
  paymentOption?: PaymentOption | null;
  address?: Address | null;
  caloricIntake?: UserCaloricIntake | null;
};

export default function AiSuggestion() {
  const [user, setUser] = useState<UserData | null>(null);
  const [suggestion, setSuggestion] = useState<any>("");
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchUserInfo();
    }, [])
  );

  const fetchUserInfo = async () => {
    try {
      const userId = await getUserInfo();

      if (!userId) {
        throw new Error("Error in fetching user id");
      }

      const response = await fetch(
        `http://10.0.2.2:3000/api/users/user/${userId}`
      );

      if (!response) {
        throw new Error("Error fetching user from API");
      }

      const user = await response.json();

      setUser(user);
    } catch (error) {
      console.error(
        "Sorry, the server is busy. Please try again later.",
        error
      );
    }
  };

  const fetchMealSuggestion = async () => {
    try {
      setIsSuggesting(true);

      const userId = await getUserInfo();

      if (!userId) return;

      const response = await fetch(
        `http://10.0.2.2:3000/api/ai/meal-suggestions?userId=${userId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const mealSuggestion = await response.json();
      // console.log(mealSuggestion);
      setSuggestion(mealSuggestion);
    } catch (error) {
      console.error(
        "Sorry, the server is busy. Please try again later.",
        error
      );
    } finally {
      setIsSuggesting(false);
    }
  };

  if (!user) return <DotsLoader />;

  return (
    <LinearGradient colors={["#F7F9FC", "#EFF2F7"]} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* User Header */}
        <View style={styles.userHeader}>
          <Text style={styles.greeting}>Hello, {user.firstName}!</Text>
        </View>

        {/* User Status Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Status</Text>
          <View style={styles.statusGrid}>
            <StatusItem label="Goal" value={user.goals} />
            <StatusItem label="Activity Level" value={user.activityLevel} />
            <StatusItem label="Weight" value={`${user.weight} kg`} />
            <StatusItem label="Height" value={`${user.height} cm`} />
          </View>
        </View>

        {/* Calories Display */}
        <View style={styles.calorieCard}>
          <Text style={styles.calorieLabel}>Daily Caloric Needs</Text>
          <Text style={styles.calorieValue}>
            {user.caloricIntake?.caloricIntake || "0"}
            <Text style={styles.calorieUnit}> kcal</Text>
          </Text>
        </View>

        {/* Macros Display */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Macronutrient Distribution</Text>
          <View style={styles.macrosContainer}>
            <MacroPill
              label="Protein"
              value={
                user.caloricIntake?.protein
                  ? Number(user.caloricIntake.protein.toFixed(2))
                  : 0
              }
              unit="g"
              color="#B03A2E"
            />
            <MacroPill
              label="Carbs"
              value={
                user.caloricIntake?.carbs
                  ? Number(user.caloricIntake.carbs.toFixed(2))
                  : 0
              }
              unit="g"
              color="#F5A623"
            />
            <MacroPill
              label="Fat"
              value={
                user.caloricIntake?.fat
                  ? Number(user.caloricIntake.fat.toFixed(2))
                  : 0
              }
              unit="g"
              color="#50E3C2"
            />
          </View>
        </View>

        {/* Suggestion Section */}
        <TouchableOpacity
          style={[styles.button, isSuggesting && styles.disabledButton]}
          onPress={() => fetchMealSuggestion()}
          disabled={isSuggesting}
        >
          {isSuggesting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>
              <Ionicons name="sparkles" size={16} color="white" /> Generate Meal
              Plan
            </Text>
          )}
        </TouchableOpacity>

        {suggestion && (
          <View style={styles.suggestionCard}>
            <View style={styles.suggestionHeader}>
              <Text style={styles.suggestionTitle}>
                Your Personalized Meal Plan
              </Text>
              <TouchableOpacity onPress={() => fetchMealSuggestion()}>
                <Ionicons name="refresh" size={20} color="#B03A2E" />
              </TouchableOpacity>
            </View>

            {/** Ensure suggestion is parsed before mapping */}
            {suggestion && suggestion.suggestions ? (
              suggestion.suggestions.map(
                (
                  meal: {
                    food_name: string;
                    reason: string;
                    id: number;
                    restaurantId: number;
                  },
                  index: number
                ) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.mealItem}
                    onPress={() =>
                      router.replace({
                        pathname: "/details",
                        params: { restaurantId: meal.restaurantId },
                      })
                    }
                  >
                    <Ionicons
                      name="nutrition"
                      size={16}
                      color="#B03A2E"
                      style={styles.mealIcon}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.mealText}>
                        <Text style={{ fontWeight: "bold" }}>
                          {meal.food_name}
                        </Text>
                      </Text>
                      <Text style={styles.reasonText}>{meal.reason}</Text>
                    </View>
                  </TouchableOpacity>
                )
              )
            ) : (
              <Text style={styles.errorText}>No suggestions available</Text>
            )}

            <Text style={styles.disclaimer}>
              Based on your daily needs of{" "}
              {user.caloricIntake?.caloricIntake.toFixed(2)} calories
            </Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const StatusItem = ({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) => (
  <View style={styles.statusItem}>
    <Text style={styles.statusLabel}>{label}</Text>
    <Text style={styles.statusValue}>{value || "--"}</Text>
  </View>
);

const MacroPill = ({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  color: string;
}) => (
  <View style={[styles.macroPill, { backgroundColor: `${color}20` }]}>
    <Text style={[styles.macroLabel, { color }]}>{label}</Text>
    <Text style={styles.macroValue}>
      {value}
      <Text style={styles.macroUnit}> {unit}</Text>
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F9FC",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  userHeader: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  statusItem: {
    width: "48%",
    backgroundColor: "#F7F9FC",
    borderRadius: 12,
    padding: 12,
  },
  statusLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  calorieCard: {
    backgroundColor: "#B03A2E",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
  },
  calorieLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    marginBottom: 8,
  },
  calorieValue: {
    color: "white",
    fontSize: 36,
    fontWeight: "700",
  },
  calorieUnit: {
    fontSize: 18,
    fontWeight: "500",
  },
  macrosContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  macroPill: {
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    flex: 1,
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 2,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  macroUnit: {
    fontSize: 12,
    color: "#666",
  },
  button: {
    backgroundColor: "#B03A2E",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
    flexDirection: "row",
    gap: 8,
  },
  disabledButton: {
    backgroundColor: "#FCA2A2",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  suggestionCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  suggestionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#B03A2E",
  },
  suggestionText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#444",
  },
  mealPlanContainer: {
    marginTop: 12,
  },
  mealItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F3",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  mealIcon: {
    marginRight: 10,
  },
  mealText: {
    flex: 1,
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  disclaimer: {
    marginTop: 16,
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
  reasonText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    fontStyle: "italic",
  },
  errorText: {
    fontSize: 14,
    color: "#FF474C",
    marginTop: 8,
    fontStyle: "italic",
  },
});
