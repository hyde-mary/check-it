import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Link } from "expo-router";
import Colors from "../../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { saveToken, saveUserInfo } from "../../utils/sessionManager";
import { router } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://10.0.2.2:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid Credentials. Please try again.");
      }

      await saveToken(data.token);
      await saveUserInfo(data.userId);

      Alert.alert("Success", "Login successful!");
      router.replace("/");
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to connect to the server.");
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
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Ionicons name="restaurant" size={48} color="black" />
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          <View style={styles.formContainer}>
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={Colors.primary} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#6B7280"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={Colors.primary}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#6B7280"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <Link href="/#" asChild>
              <TouchableOpacity style={styles.forgotPasswordText}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </Link>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account?</Text>
              <Link href="/register" asChild>
                <TouchableOpacity>
                  <Text style={styles.registerLink}> Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
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
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: 40,
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
  passwordToggle: {
    padding: 8,
  },
  button: {
    backgroundColor: "#ff9999",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  disabledButton: {
    backgroundColor: "#ffcccc",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorContainer: {
    backgroundColor: "#ffe6e6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#ff6666",
    textAlign: "center",
  },
  forgotPasswordText: {
    color: "#ff9999",
    fontSize: 14,
    marginTop: 8,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  registerText: {
    color: "#1F2937",
  },
  registerLink: {
    color: "#ff9999",
    fontWeight: "bold",
  },
});
