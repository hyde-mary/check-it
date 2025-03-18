import { useRegisterStore } from "@/store/useRegisterStore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("Male");
  const [loading, setLoading] = useState(false);

  const updateUserData = useRegisterStore((state) => state.updateUserData);

  const handleRegister = async () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !birthday ||
      !height ||
      !weight
    ) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    const birthdayRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!birthdayRegex.test(birthday)) {
      Alert.alert("Error", "Birthday must be in YYYY-MM-DD format.");
      return;
    }

    const [year, month, day] = birthday.split("-").map(Number);
    const parsedDate = new Date(year, month - 1, day);

    if (
      parsedDate.getFullYear() !== year ||
      parsedDate.getMonth() + 1 !== month || // JS Date months are 0-based
      parsedDate.getDate() !== day
    ) {
      Alert.alert("Error", "Invalid date. Please enter a real birthday.");
      return;
    }

    const heightNum = Number(height);
    const weightNum = Number(weight);

    if (
      isNaN(heightNum) ||
      isNaN(weightNum) ||
      heightNum <= 0 ||
      weightNum <= 0
    ) {
      Alert.alert("Error", "Height and weight must be positive numbers.");
      return;
    }

    if (heightNum > 300) {
      Alert.alert("Error", "Height must be 300 cm or less.");
      return;
    }

    if (weightNum > 1000) {
      Alert.alert("Error", "Weight must be 1000 kg or less.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `http://10.0.2.2:3000/api/users/check-email?email=${email}`
      );

      const data = await response.json();

      if (data.exists) {
        Alert.alert("Error", "User already exists.");
        return;
      }

      updateUserData({
        firstName,
        lastName,
        email,
        password,
        birthday,
        height: heightNum,
        weight: weightNum,
        gender,
      });

      router.push("/activity-level");
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#ffe6e6", "#ff9999"]} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Ionicons name="restaurant" size={48} color="#6B7280" />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Get started with Check It</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputRow}>
              <Ionicons name="person-outline" size={20} color="#ff9999" />
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="#6B7280"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <View style={styles.inputRow}>
              <Ionicons name="person-outline" size={20} color="#ff9999" />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor="#6B7280"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

            <View style={styles.inputRow}>
              <Ionicons name="mail-outline" size={20} color="#ff9999" />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#6B7280"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={20} color="#ff9999" />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#6B7280"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={20} color="#ff9999" />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#6B7280"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputRow}>
              <Ionicons name="egg-outline" size={20} color="#ff9999" />
              <TextInput
                style={styles.input}
                placeholder="Birthday (YYYY-MM-DD)"
                placeholderTextColor="#6B7280"
                value={birthday}
                onChangeText={setBirthday}
              />
            </View>

            <View style={styles.measurementContainer}>
              <View style={[styles.inputRow, styles.measurementInput]}>
                <Ionicons name="resize-outline" size={20} color="#ff9999" />
                <TextInput
                  style={styles.input}
                  placeholder="Height (cm)"
                  placeholderTextColor="#6B7280"
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputRow, styles.measurementInput]}>
                <Ionicons name="barbell-outline" size={20} color="#ff9999" />
                <TextInput
                  style={styles.input}
                  placeholder="Weight (kg)"
                  placeholderTextColor="#6B7280"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "Male" && styles.selectedGender,
                ]}
                onPress={() => setGender("Male")}
              >
                <Text
                  style={[
                    styles.genderText,
                    gender === "Male" && styles.selectedGenderText,
                  ]}
                >
                  Male
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "Female" && styles.selectedGender,
                ]}
                onPress={() => setGender("Female")}
              >
                <Text
                  style={[
                    styles.genderText,
                    gender === "Female" && styles.selectedGenderText,
                  ]}
                >
                  Female
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.disabledButton]}
              onPress={handleRegister}
              activeOpacity={0.7}
              disabled={loading}
            >
              <Text
                style={[
                  styles.buttonText,
                  loading && styles.disabledButtonText,
                ]}
              >
                {loading ? "Loading..." : "Continue"}
              </Text>
            </TouchableOpacity>

            <Link href="/login" asChild>
              <TouchableOpacity style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account?</Text>
                <TouchableOpacity>
                  <Text style={styles.loginLinkText}> Login</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
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
  inputRow: {
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
  measurementContainer: {
    flexDirection: "row",
    gap: 12,
  },
  measurementInput: {
    flex: 1,
  },
  genderContainer: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 16,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#fff0f0",
    alignItems: "center",
  },
  selectedGender: {
    backgroundColor: "#ff9999",
  },
  genderText: {
    color: "#ff9999",
    fontWeight: "500",
  },
  selectedGenderText: {
    color: "white",
  },
  button: {
    backgroundColor: "#ff9999",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    color: "#1F2937",
  },
  loginLink: {
    alignSelf: "center",
    marginTop: 24,
  },
  loginLinkText: {
    color: "#ff9999",
    fontWeight: "500",
  },
  disabledButton: {
    backgroundColor: "#ffcccc",
  },
  disabledButtonText: {
    color: "#aaa",
  },
});
