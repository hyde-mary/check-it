import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { Link, router } from "expo-router";
import getImageSrc from "@/utils/getImageSrc";
import Colors from "@/constants/Colors";
import { Restaurant } from "@prisma/client";

const RestaurantsPicks = ({
  restaurants,
}: {
  restaurants: Restaurant[] | null;
}) => {
  if (!restaurants || restaurants.length === 0) {
    return <Text style={styles.noData}>No restaurants available</Text>;
  }

  const scrollViewRef = useRef<ScrollView>(null);

  // Calculate mean rating across all restaurants
  const meanRating =
    restaurants.reduce((acc, r) => acc + r.rating, 0) / restaurants.length;
  const minRatings = 50;

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, animated: true });
    }
  }, [restaurants]);

  const sortedRestaurants = [...restaurants]
    .map((restaurant) => {
      const R = restaurant.rating;
      const v = restaurant.ratingsCount;
      const C = meanRating;
      const m = minRatings;

      const weightedRating = (R * v + C * m) / (v + m);
      return { ...restaurant, weightedRating };
    })
    .sort((a, b) => b.weightedRating - a.weightedRating);

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ padding: 15 }}
    >
      {sortedRestaurants.map((restaurant) => (
        <TouchableOpacity
          key={restaurant.id}
          onPress={() =>
            router.replace({
              pathname: "/details",
              params: { restaurantId: restaurant.id },
            })
          }
        >
          <View style={styles.categoryCard}>
            <Image source={getImageSrc(restaurant.img)} style={styles.image} />
            <View style={styles.categoryBox}>
              <Text style={styles.categoryText}>{restaurant.name}</Text>
              <Text style={{ color: Colors.green }}>
                {restaurant.rating} ({restaurant.ratingsCount})
              </Text>
              <Text style={{ color: Colors.medium }}>
                {restaurant.distance}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  categoryCard: {
    width: 300,
    height: 250,
    backgroundColor: "#fff",
    marginEnd: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    borderRadius: 4,
  },
  categoryText: {
    paddingVertical: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
  image: {
    flex: 5,
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  categoryBox: {
    flex: 2,
    padding: 10,
  },
  noData: {
    textAlign: "center",
    padding: 20,
    fontSize: 16,
    color: Colors.medium,
  },
});

export default RestaurantsPicks;
