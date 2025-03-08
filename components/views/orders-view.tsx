import { getUserInfo } from "@/utils/sessionManager";
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Order, User } from "@prisma/client";
import { DotsLoader } from "../Loading";
import Colors from "@/constants/Colors";

const OrdersView = () => {
  const [userData, setUserData] = useState<Omit<User, "password"> | null>(null);
  const [userOrders, setUserOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const user = await getUserInfo();
      if (!user) return;
      setUserData(user);

      const response = await fetch("http://10.0.2.2:3000/order/userOrders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        throw new Error("Error fetching orders");
      }

      const orders = await response.json();
      setUserOrders(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!userData || loading) return <DotsLoader />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Orders</Text>

      <FlatList
        data={userOrders || []}
        keyExtractor={(item) => item.orderId.toString()}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <View style={styles.row}>
              <Text style={styles.label}>Order ID:</Text>
              <Text style={styles.value}>#{item.orderId}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>
                {new Date(item.orderTime).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Status:</Text>
              <Text
                style={[styles.status, { color: getStatusColor(item.status) }]}
              >
                {item.status}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noOrders}>No orders found</Text>
        }
        nestedScrollEnabled={true}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  );
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return Colors.primary;
    case "completed":
      return Colors.green;
    case "cancelled":
      return Colors.warning;
    default:
      return Colors.medium;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.lightGrey,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.mediumDark,
    marginBottom: 20,
  },
  orderItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    color: Colors.medium,
    fontSize: 14,
  },
  value: {
    color: Colors.mediumDark,
    fontSize: 14,
    fontWeight: "500",
  },
  status: {
    fontSize: 14,
    fontWeight: "500",
  },
  noOrders: {
    textAlign: "center",
    color: Colors.medium,
    marginTop: 20,
  },
});

export default OrdersView;
