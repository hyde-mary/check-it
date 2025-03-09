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
import {
  Address,
  PaymentOption,
  User,
  UserCaloricIntake,
} from "@prisma/client";
import { DotsLoader } from "@/components/Loading";
import Toast from "react-native-toast-message";
import Colors from "@/constants/Colors";

type UserData = Omit<User, "password"> & {
  paymentOption?: PaymentOption | null;
  address?: Address | null;
  caloricIntake?: UserCaloricIntake | null;
};

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchUserInfo();
  }, []);

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
      user.paymentOption = user.paymentOptions?.[0] || null;

      setUser(user);
    } catch (error) {
      console.error("Error fetching user info");
    }
  };

  const handleChange = (
    key: keyof UserData,
    value: any,
    nestedKey?: string
  ) => {
    setUser((prev) => {
      if (!prev) return null;

      if (key === "paymentOption" && nestedKey) {
        return {
          ...prev,
          paymentOption: {
            ...(prev.paymentOption || {}),
            [nestedKey]: value,
          },
        };
      }

      if (nestedKey) {
        return {
          ...prev,
          [key]: {
            ...(prev[key] as Record<string, any>),
            [nestedKey]: value,
          },
        };
      }

      return { ...prev, [key]: value };
    });
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

  const handleSave = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://10.0.2.2:3000/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user }),
      });

      if (!response.ok) {
        throw new Error("Response not ok");
      }

      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: "Your Profile has been Updated!",
        position: "top",
        visibilityTime: 3000,
      });

      fetchUserInfo();
    } catch (error) {
      console.error("Error updating profile, please try again later.", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await removeToken();
    await removeUserInfo();
    router.replace("/login");
  };

  if (!user) return <DotsLoader />;

  // console.log(user);

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
              value={user.firstName}
              onChangeText={(text) => handleChange("firstName", text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="people-outline" size={20} color="#ff6666" />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="#6B7280"
              value={user.lastName}
              onChangeText={(text) => handleChange("lastName", text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#ff6666" />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#6B7280"
              value={user.email}
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
                value={String(user.height)}
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
                value={String(user.weight)}
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
                  user.activityLevel === activityLevelMapping[level] &&
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
                  user.goals === goalsMapping[goal] && styles.selectedOption,
                ]}
                onPress={() => handleChange("goals", goalsMapping[goal])}
              >
                <Text style={styles.optionText}>{goal}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Payment Method */}
          <Text style={styles.sectionTitle}>Payment Method</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="card-outline" size={20} color="#ff6666" />
            <TextInput
              style={styles.input}
              placeholder="Card Number"
              placeholderTextColor="#6B7280"
              value={user.paymentOption?.cardNumber || ""}
              onChangeText={(text) =>
                handleChange("paymentOption", text, "cardNumber")
              }
              keyboardType="numeric"
              maxLength={15}
            />
          </View>

          <View style={styles.metricRow}>
            <View style={[styles.inputContainer, styles.measurementInput]}>
              <Ionicons name="calendar-outline" size={20} color="#ff6666" />
              <TextInput
                style={styles.input}
                placeholder="YYYY/MM"
                placeholderTextColor="#6B7280"
                value={
                  user.paymentOption?.expirationDate
                    ? String(user.paymentOption.expirationDate).slice(0, 7)
                    : ""
                }
                onChangeText={(text) =>
                  handleChange("paymentOption", text, "expirationDate")
                }
                maxLength={7}
              />
            </View>

            <View style={[styles.inputContainer, styles.measurementInput]}>
              <Ionicons name="lock-closed-outline" size={20} color="#ff6666" />
              <TextInput
                style={styles.input}
                placeholder="CVC"
                placeholderTextColor="#6B7280"
                value={
                  user.paymentOption?.cardCv
                    ? String(user.paymentOption.cardCv)
                    : ""
                }
                onChangeText={(text) =>
                  handleChange("paymentOption", text, "cardCv")
                }
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
          </View>

          {/* Address Information */}
          <Text style={styles.sectionTitle}>Address Information</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="home-outline" size={20} color="#ff6666" />
            <TextInput
              style={styles.input}
              placeholder="Street Address"
              placeholderTextColor="#6B7280"
              value={user.address?.street || ""}
              onChangeText={(text) => handleChange("address", text, "street")}
            />
          </View>

          <View style={styles.metricRow}>
            <View style={[styles.inputContainer, styles.measurementInput]}>
              <Ionicons name="business-outline" size={20} color="#ff6666" />
              <TextInput
                style={styles.input}
                placeholder="City"
                placeholderTextColor="#6B7280"
                value={user.address?.city || ""}
                onChangeText={(text) => handleChange("address", text, "city")}
              />
            </View>

            <View style={[styles.inputContainer, styles.measurementInput]}>
              <Ionicons name="map-outline" size={20} color="#ff6666" />
              <TextInput
                style={styles.input}
                placeholder="State"
                placeholderTextColor="#6B7280"
                value={user.address?.state || ""}
                onChangeText={(text) => handleChange("address", text, "state")}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#ff6666" />
            <TextInput
              style={styles.input}
              placeholder="ZIP Code"
              placeholderTextColor="#6B7280"
              value={user.address?.zipCode || ""}
              onChangeText={(text) => handleChange("address", text, "zipCode")}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.disabledButton]}
            onPress={handleSave}
            disabled={loading}
          >
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text style={styles.saveButtonText}>
              {loading ? `Updating...` : `Save Changes`}
            </Text>
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
  disabledButton: {
    backgroundColor: Colors.mediumDark,
    opacity: 0.7,
  },
  logoutButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
});

export default Profile;
