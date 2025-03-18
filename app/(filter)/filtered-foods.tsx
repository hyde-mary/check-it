import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import getImageSrc from "@/utils/getImageSrc";
import { Restaurant } from "@prisma/client";
import { Ionicons } from "@expo/vector-icons";

interface FoodItem {
  id: number;
  name: string;
  img: string;
  categoryId: number;
  restaurant: Restaurant;
}

const FilteredFoods = () => {
  const router = useRouter();
  const { selectedCategoryIds } = useLocalSearchParams<{
    selectedCategoryIds?: string;
  }>();

  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilteredFoods = async () => {
      try {
        const response = await fetch(
          `http://10.0.2.2:3000/api/foods/categories/${selectedCategoryIds}`
        );
        if (!response.ok) throw new Error("Failed to fetch foods");
        const data: FoodItem[] = await response.json();
        setFoods(data);
      } catch (err: any) {
        setError(err.message || "Failed to load foods");
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredFoods();
  }, [selectedCategoryIds]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={foods}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/dish/${item.id}`)}
          >
            <View style={styles.cardDescription}>
              <Image source={getImageSrc(item.img)} style={styles.image} />
              <View style={styles.description}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.restaurantName}>
                  {item.restaurant.name}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="gray" />
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Back to Filters</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  foodName: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    borderRadius: 8,
  },
  backText: {
    color: "white",
    fontWeight: "bold",
  },
  description: {
    flexDirection: "column",
  },
  restaurantName: {
    marginLeft: 10,
    fontSize: 16,
  },
  cardDescription: {
    flexDirection: "row",
  },
});

export default FilteredFoods;
