import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { Link } from "expo-router";
import { Restaurant } from "@prisma/client";
import getImageSrc from "@/utils/getImageSrc";
import Colors from "@/constants/Colors";

const RestaurantsNear = ({
  restaurants,
}: {
  restaurants: Restaurant[] | null;
}) => {
  if (!restaurants || restaurants.length === 0) {
    return <Text style={styles.noData}>No restaurants available</Text>;
  }

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, animated: true });
    }
  }, [restaurants]);

  const top3Restaurants = restaurants
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);

  return (
    <ScrollView
      horizontal
      ref={scrollViewRef}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        padding: 15,
      }}
    >
      {top3Restaurants.map((restaurant) => (
        <Link
          href={{
            pathname: "/details",
            params: { restaurantId: restaurant.id },
          }}
          key={restaurant.id}
          asChild
        >
          <TouchableOpacity>
            <View style={styles.categoryCard}>
              <Image
                source={getImageSrc(restaurant.img)}
                style={styles.image}
              />
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
        </Link>
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

export default RestaurantsNear;
