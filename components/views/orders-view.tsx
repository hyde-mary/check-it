import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

const OrdersView = () => {
  const [orders, setOrders] = useState([
    { id: 1, total: 25.99, status: "Delivered" },
    { id: 2, total: 15.49, status: "Pending" },
    { id: 3, total: 30.0, status: "Cancelled" },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate API fetch delay
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#ff6666" style={styles.loader} />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Orders</Text>
      {orders.length === 0 ? (
        <Text style={styles.noOrders}>No orders found.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <Text style={styles.orderText}>Order ID: {item.id}</Text>
              <Text style={styles.orderText}>Total: ${item.total}</Text>
              <Text style={styles.orderText}>Status: {item.status}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  loader: { marginTop: 20 },
  noOrders: { textAlign: "center", marginTop: 20, fontSize: 16 },
  orderItem: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  orderText: { fontSize: 16 },
});

export default OrdersView;
