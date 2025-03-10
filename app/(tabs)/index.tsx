import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Touchable,
  TouchableOpacity,
} from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useCallback, useEffect, useRef, useState } from "react";
import { Category, Order, Restaurant } from "@prisma/client";
import { DotsLoader } from "@/components/Loading";
import Colors from "@/constants/Colors";
import Categories from "@/components/index/Categories";
import RestaurantsPicks from "@/components/index/RestaurantsPicks";
import RestaurantsNear from "@/components/index/RestaurantsNear";
import { getUserInfo } from "@/utils/sessionManager";
import { Link, router } from "expo-router";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import getImageSrc from "@/utils/getImageSrc";
import Toast from "react-native-toast-message";
import useBasketStore from "@/store/useBasketStore";
import { SafeAreaView } from "react-native-safe-area-context";
// import { getUserInfo } from "@/utils/sessionManager";

type Food = {
  id: number;
  name: string;
  price: number;
  img: string;
};

type OrderItem = {
  id: number;
  quantity: number;
  food: Food;
};

type OrderWithItems = Order & {
  restaurant: Restaurant;
  orderItems: OrderItem[];
  subtotal: number;
  fees: number;
  totalPrice: number;
};

export default function Page() {
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>();
  const [categories, setCategories] = useState<Category[] | null>();
  const [pendingOrders, setPendingOrders] = useState<OrderWithItems[] | null>(
    null
  );
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [receiveLoading, setReceiveLoading] = useState<boolean>(false);
  const { items, total } = useBasketStore();

  useEffect(() => {
    fetchAllRestaurant();
    fetchAllCategory();
    fetchPendingOrders();
  }, []);

  const fetchAllCategory = async () => {
    // const userInfo = await getUserInfo();
    // console.log(userInfo);
    try {
      const response = await fetch("http://10.0.2.2:3000/api/categories/");

      if (!response) {
        throw new Error("Connection error");
      }

      const categories = await response.json();

      if (!categories) {
        throw new Error("Category Data error");
      }

      setCategories(categories);
    } catch (error) {
      console.error(
        "Something went wrong. Please contact the administrators",
        error
      );
    }
  };

  const fetchAllRestaurant = async () => {
    try {
      const response = await fetch("http://10.0.2.2:3000/api/restaurants/");

      if (!response) {
        throw new Error("Connection error");
      }

      const restaurant = await response.json();

      if (!restaurant) {
        throw new Error("Restaurant Data error");
      }

      setRestaurants(restaurant);
    } catch (error) {
      console.error(
        "Something went wrong. Please contact the administrators",
        error
      );
    }
  };

  const fetchPendingOrders = async () => {
    try {
      const userId = await getUserInfo();
      if (!userId) return;

      const response = await fetch(
        `http://10.0.2.2:3000/api/orders/pending/${userId}`
      );

      if (!response.ok) throw new Error("Error fetching pending orders");

      const orders: OrderWithItems[] = await response.json();
      setPendingOrders(orders);
    } catch (error) {
      console.error("Error fetching pending orders:", error);
    }
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const formatCurrency = (value: number) => {
    return `₱${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleMarkReceived = async (orderId: number) => {
    try {
      setReceiveLoading(true);
      const response = await fetch(
        `http://10.0.2.2:3000/api/orders/receive/${orderId}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) throw new Error("Error marking order as received");

      setPendingOrders((prevOrders) =>
        prevOrders
          ? prevOrders.filter((order) => order.orderId !== orderId)
          : []
      );

      await fetchPendingOrders();

      Toast.show({
        type: "success",
        text1: "Order Received",
        text2: "Your order has been marked as received!",
        position: "bottom",
        visibilityTime: 2000,
      });

      bottomSheetModalRef.current?.dismiss();
    } catch (error) {
      console.error("Error marking order as received:", error);
    } finally {
      setReceiveLoading(false);
    }
  };

  if (!categories || !restaurants) return <DotsLoader />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: pendingOrders?.length ? 125 : 40,
        }}
      >
        <Categories categories={categories} />
        <Text style={styles.header}>Top Picks in your Neighbourhood</Text>
        <RestaurantsPicks restaurants={restaurants} />
        <Text style={styles.header}>
          Offers near you (Top 3 Based on Distance)
        </Text>
        <RestaurantsNear restaurants={restaurants} />
      </ScrollView>

      {items > 0 && (
        <View style={styles.footer}>
          <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "#fff" }}>
            <Link href="/basket" asChild>
              <TouchableOpacity style={styles.fullButton}>
                <Text style={styles.basket}>{items}</Text>
                <Text style={styles.footerText}>View Basket</Text>
                <Text style={styles.basketTotal}>₱{total.toFixed(2)}</Text>
              </TouchableOpacity>
            </Link>
          </SafeAreaView>
        </View>
      )}

      {pendingOrders && pendingOrders.length > 0 && (
        <TouchableOpacity onPress={handlePresentModalPress}>
          <View style={styles.pendingOrderContainer}>
            <Text style={styles.pendingOrderHeader}>Ongoing Order</Text>
            <Text style={styles.restaurantName}>
              {pendingOrders[0].restaurant.name}
            </Text>
            <View style={styles.orderDetails}>
              <Text style={styles.detailText}>
                Ordered:{" "}
                {new Date(pendingOrders[0].orderTime).toLocaleTimeString()}
              </Text>
              <Text style={styles.detailText}>
                Estimated delivery: {pendingOrders[0].restaurant.deliveryTime}{" "}
                mins
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={2}
        snapPoints={["40%", "90%"]}
        backgroundStyle={styles.bottomSheet}
        onChange={handleSheetChanges}
      >
        <BottomSheetScrollView style={styles.sheetContent}>
          {pendingOrders?.map((order) => (
            <View key={order.orderId}>
              {/* header part */}
              <View style={styles.restaurantHeader}>
                <Image
                  source={getImageSrc(order.restaurant.img)}
                  style={styles.restaurantImage}
                />
                <View style={styles.restaurantInfo}>
                  <Text style={styles.sheetRestaurant}>
                    {order.restaurant.name}
                  </Text>
                  <Text style={styles.deliveryTime}>
                    {order.restaurant.deliveryTime} min delivery
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.receivedButton,
                    receiveLoading && styles.receivedButtonDisabled,
                  ]}
                  onPress={() => handleMarkReceived(order.orderId)}
                  disabled={receiveLoading}
                >
                  <Text style={styles.receivedButtonText}>
                    Mark as Received
                  </Text>
                </TouchableOpacity>
              </View>

              {/* items part */}
              <Text style={styles.itemsTitle}>Your Order</Text>
              <ScrollView>
                {order.orderItems.map((orderItem, index) => (
                  <View key={index} style={styles.foodItem}>
                    <Image
                      source={getImageSrc(orderItem.food.img)}
                      style={styles.foodImage}
                    />
                    <View style={styles.foodDetails}>
                      <Text style={styles.foodName}>{orderItem.food.name}</Text>
                      <Text style={styles.foodPrice}>
                        {formatCurrency(
                          orderItem.food.price * orderItem.quantity
                        )}
                      </Text>
                    </View>
                    <Text style={styles.quantity}>x{orderItem.quantity}</Text>
                  </View>
                ))}
              </ScrollView>

              <View style={styles.priceBreakdown}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Subtotal:</Text>
                  <Text style={styles.priceValue}>
                    {formatCurrency(order.subtotal)}
                  </Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Fees:</Text>
                  <Text style={styles.priceValue}>
                    {formatCurrency(order.fees)}
                  </Text>
                </View>
                <View style={[styles.priceRow, styles.totalRow]}>
                  <Text style={[styles.priceLabel, styles.totalLabel]}>
                    Total:
                  </Text>
                  <Text style={[styles.priceValue, styles.totalPrice]}>
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </View>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Estimated arrival:</Text>
                <Text style={styles.summaryValue}>
                  {new Date(
                    new Date(order.orderTime).getTime() +
                      order.restaurant.deliveryTime * 60000
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </View>
          ))}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightGrey,
    flex: 1,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  pendingOrderContainer: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    zIndex: 100,
  },
  pendingOrderHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.mediumDark,
    marginBottom: 4,
  },
  orderDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailText: {
    color: Colors.medium,
    fontSize: 12,
  },
  bottomSheet: {
    backgroundColor: "#fff",
    borderRadius: 16,
  },
  sheetContent: {
    padding: 20,
  },
  sheetHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sheetRestaurant: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  sheetItem: {
    fontSize: 14,
    marginBottom: 5,
  },
  orderItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: Colors.lightGrey,
    borderRadius: 8,
  },
  orderTime: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 8,
  },
  floatingOrderButton: {
    position: "absolute",
    bottom: 20,
    right: 16,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  orderText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  restaurantHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  restaurantImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  deliveryTime: {
    color: Colors.medium,
    fontSize: 14,
  },
  itemsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  foodItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 15,
  },
  foodImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  foodDetails: {
    flex: 1,
  },
  foodName: {
    fontSize: 14,
    fontWeight: "500",
  },
  foodPrice: {
    fontSize: 12,
    color: Colors.medium,
  },
  quantity: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingTop: 15,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: Colors.lightGrey,
  },
  summaryLabel: {
    color: Colors.medium,
  },
  summaryValue: {
    fontWeight: "500",
  },
  restaurantInfo: {
    flex: 1,
  },
  receivedButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  receivedButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  priceBreakdown: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
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
  },
  totalLabel: {
    fontWeight: "600",
  },
  totalPrice: {
    color: Colors.primary,
    fontWeight: "700",
    fontSize: 16,
  },
  receivedButtonDisabled: {
    backgroundColor: "#A9A9A9",
    opacity: 0.6,
  },
  footer: {
    position: "absolute",
    backgroundColor: "#fff",
    bottom: 0,
    left: 0,
    width: "100%",
    padding: 16,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  fullButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 56,
    gap: 8,
  },
  footerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
    marginLeft: 8,
  },
  basket: {
    color: "#fff",
    backgroundColor: "#19AA86",
    fontWeight: "bold",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 100,
    fontSize: 14,
    minWidth: 28,
    textAlign: "center",
  },
  basketTotal: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 4,
  },
});
