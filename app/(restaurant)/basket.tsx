import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import useBasketStore from "@/store/useBasketStore";
import SwipeableRow from "@/components/SwipeableRow";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
import getImageSrc from "@/utils/getImageSrc";
import { getUserInfo } from "@/utils/sessionManager";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Address,
  PaymentOption,
  User,
  UserCaloricIntake,
} from "@prisma/client";
import { DotsLoader } from "@/components/Loading";
import Toast from "react-native-toast-message";

type UserData = Omit<User, "password"> & {
  paymentOption?: PaymentOption | null;
  address?: Address | null;
  caloricIntake?: UserCaloricIntake | null;
};

type MacroKey = "caloricIntake" | "protein" | "carbs" | "fat";

const Basket = () => {
  const {
    foods,
    increaseFood,
    reduceFood,
    clearFood,
    clearBasket,
    items,
    total,
  } = useBasketStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<"cash" | "card">(
    "cash"
  );
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const userId = await getUserInfo();

      if (!userId) {
        throw new Error("Missing user info");
      }

      const response = await fetch(
        `http://10.0.2.2:3000/api/users/user/${userId}`
      );

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

  const fees = {
    service: 20, // 20 pesos ig
    delivery: 60, // 60 pesos ig
  };

  const totalMacros = foods.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories * food.quantity,
      protein: acc.protein + food.protein * food.quantity,
      carbs: acc.carbs + food.carbs * food.quantity,
      fat: acc.fat + food.fat * food.quantity,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const formatCurrency = (value: number) =>
    value.toLocaleString("en-US", { style: "currency", currency: "PHP" });

  const calculateTotal = () => {
    const subtotal = isNaN(total) ? 0 : total;
    return subtotal + fees.service + fees.delivery;
  };

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);

      const userId = await getUserInfo();
      if (!userId) {
        console.error("User not found");
        setIsCheckingOut(false);
        return;
      }

      if (!foods || foods.length === 0) {
        throw new Error("No food detected!");
      }

      const subtotal = foods.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const totalPrice = subtotal + fees.service + fees.delivery;

      const foodItems = foods.map((item) => ({
        foodId: item.id,
        quantity: item.quantity,
      }));

      const response = await fetch(
        "http://10.0.2.2:3000/api/orders/orderFood",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            foodItems,
            selectedPayment,
            subtotal,
            fees: fees.delivery + fees.service,
            totalPrice,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "No saved card found for this user") {
          Toast.show({
            type: "error",
            text1: "No Saved Card for this User",
            text2:
              "To Use this Payment Method! Please add a payment option first in your profile!",
            position: "top",
            visibilityTime: 2000,
          });
          return;
        }

        if (data.error === "No saved address found for this user") {
          Toast.show({
            type: "error",
            text1: "No Saved Address for this User",
            text2:
              "To Order Food, Please add an Address first in your profile!",
            position: "top",
            visibilityTime: 2000,
          });
          return;
        }

        throw new Error("Something went wrong, please try again.");
      }

      clearBasket();
      router.replace("/");
    } catch (error) {
      console.error("Error during checkout:", error);
      setIsCheckingOut(false);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!user) return <DotsLoader />;

  // console.log(user);
  // console.log(foods);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {items === 0 ? (
        <View style={styles.centeredContainer}>
          <Text style={styles.emptyText}>Your basket is empty</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              router.back();
            }}
          >
            <Text style={styles.buttonText}>Browse Restaurant</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.flexContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <FlatList
            data={foods}
            keyExtractor={(item) => `${item.id}-${item.name}`}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <Text style={styles.sectionHeader}>Your Items</Text>
            }
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            renderItem={({ item }) => (
              <SwipeableRow onDelete={() => clearFood(item)}>
                <View style={styles.itemRow}>
                  <Image
                    source={getImageSrc(item.img)}
                    style={styles.itemImage}
                  />
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => reduceFood(item)}
                    >
                      <Text style={styles.quantityText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => increaseFood(item)}
                    >
                      <Text style={styles.quantityText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>
                      {formatCurrency(item.price * item.quantity)}
                    </Text>
                  </View>
                </View>
              </SwipeableRow>
            )}
            ListFooterComponent={
              <View style={styles.summaryContainer}>
                <FeeRow label="Subtotal" value={total} />
                <FeeRow label="Service Fee" value={fees.service} />
                <FeeRow label="Delivery Fee" value={fees.delivery} />
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Order Total</Text>
                  <Text style={styles.totalValue}>
                    {formatCurrency(calculateTotal())}
                  </Text>
                </View>

                {/* Add Payment Method Section */}
                <View style={styles.paymentSection}>
                  <Text style={styles.paymentTitle}>Payment Method</Text>
                  <TouchableOpacity
                    style={[
                      styles.paymentOption,
                      selectedPayment === "cash" && styles.selectedPayment,
                    ]}
                    onPress={() => setSelectedPayment("cash")}
                  >
                    <Ionicons
                      name="cash-outline"
                      size={20}
                      color={Colors.primary}
                    />
                    <Text style={styles.paymentText}>Cash on Delivery</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.paymentOption,
                      selectedPayment === "card" && styles.selectedPayment,
                    ]}
                    onPress={() => setSelectedPayment("card")}
                  >
                    <Ionicons
                      name="card-outline"
                      size={20}
                      color={Colors.primary}
                    />
                    <Text style={styles.paymentText}>Credit/Debit Card</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.macrosContainer}>
                  <Text style={styles.macrosTitle}>Nutrition Summary</Text>

                  {["caloricIntake", "protein", "carbs", "fat"].map((macro) => {
                    const macroKey = macro as MacroKey;
                    const userLimit = user.caloricIntake?.[macroKey] || 0;
                    const consumed =
                      totalMacros[
                        macro === "caloricIntake" ? "calories" : macroKey
                      ];
                    const remaining = userLimit - consumed;
                    const progress = Math.min(
                      (consumed / userLimit) * 100,
                      100
                    );

                    return (
                      <View key={macro} style={styles.macroCard}>
                        {/* Macro Header */}
                        <View style={styles.macroHeader}>
                          <View style={styles.macroLabel}>
                            <MaterialCommunityIcons
                              name={
                                macro === "caloricIntake"
                                  ? "fire"
                                  : macro === "protein"
                                  ? "dumbbell"
                                  : macro === "carbs"
                                  ? "noodles"
                                  : "egg"
                              }
                              size={20}
                              color={Colors.medium}
                            />
                            <Text style={styles.macroText}>
                              {macro === "caloricIntake"
                                ? "Calories"
                                : macro.charAt(0).toUpperCase() +
                                  macro.slice(1)}
                            </Text>
                          </View>
                          <View style={styles.macroValues}>
                            <Text style={styles.consumedValue}>
                              {consumed.toFixed(0)}
                              {macro === "calories" ? "kcal" : "g"}
                            </Text>
                            <Text style={styles.totalValue}>
                              / {userLimit.toFixed(0)}
                              {macro === "calories" ? "kcal" : "g"}
                            </Text>
                          </View>
                        </View>

                        {/* Progress Bar */}
                        <View style={styles.progressBar}>
                          <View
                            style={[
                              styles.progressFill,
                              {
                                width: `${progress}%`,
                                backgroundColor:
                                  remaining < 0 ? "#ff4444" : Colors.primary,
                              },
                            ]}
                          />
                        </View>

                        {/* Remaining/Over Indicator */}
                        <View style={styles.remainingContainer}>
                          <Text
                            style={[
                              styles.remainingText,
                              {
                                color:
                                  remaining < 0 ? "#ff4444" : Colors.primary,
                              },
                            ]}
                          >
                            {remaining >= 0
                              ? `${remaining.toFixed(0)} ${
                                  macro === "calories" ? "kcal" : "g"
                                } remaining`
                              : `${Math.abs(remaining).toFixed(0)} ${
                                  macro === "calories" ? "kcal" : "g"
                                } over`}
                          </Text>
                          <Text style={styles.percentageText}>
                            {progress.toFixed(0)}%
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            }
          />
          <View style={styles.fixedFooter}>
            <TouchableOpacity
              style={[styles.button, isCheckingOut && styles.disabledButton]}
              onPress={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  Place Order • {formatCurrency(calculateTotal())}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const FeeRow = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.feeRow}>
    <Text style={styles.feeLabel}>{label}</Text>
    <Text style={styles.feeValue}>
      {value.toLocaleString("en-US", { style: "currency", currency: "PHP" })}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  macrosContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
  macroCard: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  lastMacroCard: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  macroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  macroValues: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  consumedValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  totalValue: {
    fontSize: 14,
    color: Colors.medium,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.lightGrey,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  remainingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  remainingText: {
    fontSize: 12,
    fontWeight: "500",
  },
  percentageText: {
    fontSize: 12,
    color: Colors.medium,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
  },
  flexContainer: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  footer: {
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    marginBottom: 50,
    paddingBottom: 50,
    borderTopColor: Colors.lightGrey,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  fixedFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
    color: Colors.primary,
    backgroundColor: "#fff",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    gap: 16,
  },
  quantity: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
  },
  itemOption: {
    fontSize: 14,
    color: Colors.medium,
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.lightGrey,
    marginHorizontal: 16,
  },
  summaryContainer: {
    backgroundColor: "#fff",
    marginTop: 16,
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  feeLabel: {
    fontSize: 16,
    color: Colors.medium,
  },
  feeValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: Colors.lightGrey,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: Colors.medium,
    opacity: 0.8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    fontSize: 18,
    color: Colors.medium,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
  },
  successText: {
    fontSize: 16,
    color: Colors.medium,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  quantityButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  quantityText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  paymentSection: {
    backgroundColor: "#fff",
    padding: 16,
    marginTop: 8,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 12,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    marginBottom: 10,
    gap: 10,
  },
  selectedPayment: {
    borderColor: Colors.primary,
    backgroundColor: "#f7f7ff",
  },
  paymentText: {
    fontSize: 16,
    color: Colors.medium,
  },
  macrosTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 16,
  },
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  macroLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  macroText: {
    fontSize: 14,
    color: Colors.medium,
  },
  macroValue: {
    fontSize: 14,
    color: Colors.medium,
  },
  macroDivider: {
    fontSize: 14,
    color: Colors.lightGrey,
  },
  macroRemaining: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default Basket;
