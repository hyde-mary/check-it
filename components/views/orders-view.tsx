import { getUserInfo } from "@/utils/sessionManager";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  RefreshControl,
} from "react-native";
import { Order, User } from "@prisma/client";
import { DotsLoader } from "../Loading";
import Colors from "@/constants/Colors";
import getImageSrc from "@/utils/getImageSrc";

type OrderWithDetails = Order & {
  restaurant: {
    id: number;
    name: string;
    img: string;
    deliveryTime: number;
  };
  subtotal: number;
  fees: number;
  totalPrice: number;
};

const OrdersView = () => {
  const [userData, setUserData] = useState<Omit<User, "password"> | null>(null);
  const [userOrders, setUserOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

      if (!response.ok) throw new Error("Error fetching orders");

      const orders = await response.json();
      setUserOrders(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const formatCurrency = (value: number | string) => {
    const amount = typeof value === "string" ? parseFloat(value) : value;
    return `₱${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-PH", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!userData || loading)
    return (
      <View style={styles.loaderContainer}>
        <DotsLoader />
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order History</Text>

      {userOrders.length === 0 ? (
        <Text style={styles.noOrders}>No orders found</Text>
      ) : (
        userOrders.map((item) => (
          <View key={item.orderId} style={styles.orderCard}>
            {/* header */}
            <View style={styles.restaurantHeader}>
              <Image
                source={getImageSrc(item.restaurant.img)}
                style={styles.restaurantImage}
              />
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>
                  {item.restaurant.name}
                </Text>
                <Text style={styles.deliveryTime}>
                  {item.restaurant.deliveryTime} min delivery
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(item.status) },
                ]}
              >
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>

            {/* details */}
            <View style={styles.detailsContainer}>
              <Text style={styles.orderDate}>{formatDate(item.orderTime)}</Text>

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Subtotal:</Text>
                <Text style={styles.priceValue}>
                  {formatCurrency(item.subtotal)}
                </Text>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Fees:</Text>
                <Text style={styles.priceValue}>
                  {formatCurrency(item.fees)}
                </Text>
              </View>

              <View style={[styles.priceRow, styles.totalRow]}>
                <Text style={[styles.priceLabel, styles.totalLabel]}>
                  Total:
                </Text>
                <Text style={[styles.priceValue, styles.totalPrice]}>
                  {formatCurrency(item.totalPrice)}
                </Text>
              </View>
            </View>
          </View>
        ))
      )}
    </View>
  );
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return Colors.primary;
    case "delivered":
      return Colors.green;
    case "cancelled":
      return Colors.warning;
    default:
      return Colors.medium;
  }
};

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    flex: 1,
    padding: 16,
    backgroundColor: Colors.lightGrey,
    borderRadius: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  restaurantHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  restaurantImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.mediumDark,
  },
  deliveryTime: {
    fontSize: 14,
    color: Colors.medium,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
    paddingTop: 12,
  },
  orderDate: {
    color: Colors.medium,
    fontSize: 14,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
  },
  priceLabel: {
    color: Colors.medium,
    fontSize: 14,
  },
  priceValue: {
    color: Colors.mediumDark,
    fontSize: 14,
    fontWeight: "500",
  },
  totalLabel: {
    fontWeight: "600",
  },
  totalPrice: {
    color: Colors.primary,
    fontWeight: "700",
    fontSize: 16,
  },
  noOrders: {
    textAlign: "center",
    color: Colors.medium,
    marginTop: 40,
    fontSize: 16,
  },
});

export default OrdersView;
