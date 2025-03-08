import { SafeAreaView, ScrollView, StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useEffect, useState } from "react";
import { Category, Restaurant } from "@prisma/client";
import { DotsLoader } from "@/components/Loading";
import Colors from "@/constants/Colors";
import Categories from "@/components/index/Categories";
import RestaurantsPicks from "@/components/index/RestaurantsPicks";
import RestaurantsNear from "@/components/index/RestaurantsNear";

export default function Page() {
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>();
  const [categories, setCategories] = useState<Category[] | null>();

  useEffect(() => {
    fetchAllRestaurant();
    fetchAllCategory();
  }, []);

  const fetchAllCategory = async () => {
    try {
      const response = await fetch("http://10.0.2.2:3000/category/");

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
      const response = await fetch("http://10.0.2.2:3000/restaurant/");

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

  if (!categories || !restaurants) return <DotsLoader />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Categories categories={categories} />
        <Text style={styles.header}>Top Picks in your Neighbourhood</Text>
        <RestaurantsPicks restaurants={restaurants} />
        <Text style={styles.header}>
          Offers near you (Top 3 Based on Distance)
        </Text>
        <RestaurantsNear restaurants={restaurants} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightGrey,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
});
