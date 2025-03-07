import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  getUserInfo,
  saveUserInfo,
  removeToken,
  removeUserInfo,
} from "@/utils/sessionManager";
import { useRouter } from "expo-router";

const Profile = () => {
  const router = useRouter();

  const [userData, setUserData] = useState({
    id: 0,
    firstName: "",
    middleName: null,
    lastName: "",
    email: "",
    gender: "",
    birthday: "",
    bmi: 0,
    height: 0,
    weight: 0,
    activityLevel: "",
    goals: "",
  });

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    const userInfo = await getUserInfo();
    if (userInfo) {
      setUserData(userInfo);
    }
  };

  const activityLevelMapping: { [key: string]: string } = {
    Sedentary: "Sedentary",
    "Lightly Active": "LightlyActive",
    "Highly Active": "HighlyActive",
  };

  const goalsMapping: { [key: string]: string } = {
    "Lose Weight": "LoseWeight",
    "Maintain Weight": "MaintainWeight",
    "Gain Weight": "GainWeight",
  };

  const handleChange = (key: string, value: string | number) => {
    if (key === "activityLevel" && typeof value === "string") {
      value = activityLevelMapping[value] || value;
    }
    if (key === "goals" && typeof value === "string") {
      value = goalsMapping[value] || value;
    }

    setUserData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    await saveUserInfo(userData);
    alert("Profile updated!");
  };

  const logout = async () => {
    await removeToken();
    await removeUserInfo();
    router.replace("/login");
  };

  return (
    <LinearGradient colors={["#ffe6e6", "#ff9999"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#ff6666" />
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#6B7280"
              value={userData.firstName}
              onChangeText={(text) => handleChange("firstName", text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="people-outline" size={20} color="#ff6666" />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="#6B7280"
              value={userData.lastName}
              onChangeText={(text) => handleChange("lastName", text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#ff6666" />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#6B7280"
              value={userData.email}
              onChangeText={(text) => handleChange("email", text)}
              keyboardType="email-address"
            />
          </View>

          <Text style={styles.sectionTitle}>Physical Metrics</Text>

          <View style={styles.metricRow}>
            <View style={[styles.inputContainer, styles.measurementInput]}>
              <Ionicons name="resize-outline" size={20} color="#ff6666" />
              <TextInput
                style={styles.input}
                placeholder="Height (cm)"
                placeholderTextColor="#6B7280"
                value={String(userData.height)}
                onChangeText={(text) =>
                  handleChange("height", parseFloat(text) || 0)
                }
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputContainer, styles.measurementInput]}>
              <Ionicons name="barbell-outline" size={20} color="#ff6666" />
              <TextInput
                style={styles.input}
                placeholder="Weight (kg)"
                placeholderTextColor="#6B7280"
                value={String(userData.weight)}
                onChangeText={(text) =>
                  handleChange("weight", parseFloat(text) || 0)
                }
                keyboardType="numeric"
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Activity & Goals</Text>

          <View style={styles.buttonGroup}>
            {["Sedentary", "Lightly Active", "Highly Active"].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.optionButton,
                  userData.activityLevel === activityLevelMapping[level] &&
                    styles.selectedOption,
                ]}
                onPress={() =>
                  handleChange("activityLevel", activityLevelMapping[level])
                }
              >
                <Text style={styles.optionText}>{level}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttonGroup}>
            {["Lose Weight", "Maintain Weight", "Gain Weight"].map((goal) => (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.optionButton,
                  userData.goals === goalsMapping[goal] &&
                    styles.selectedOption,
                ]}
                onPress={() => handleChange("goals", goalsMapping[goal])}
              >
                <Text style={styles.optionText}>{goal}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color="white" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  profileCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  sectionTitle: {
    color: "#ff6666",
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 15,
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff0f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  input: {
    flex: 1,
    height: 50,
    paddingLeft: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  metricRow: { flexDirection: "row", gap: 12 },
  measurementInput: { flex: 1 },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff6666",
    height: 50,
    borderRadius: 12,
    marginTop: 24,
    gap: 10,
  },
  saveButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  optionButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#fff0f0",
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  selectedOption: { backgroundColor: "#ff6666" },
  optionText: { fontSize: 16, color: "#333" },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff4444",
    height: 50,
    borderRadius: 12,
    marginTop: 24,
    gap: 10,
  },
  logoutButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
});

export default Profile;
