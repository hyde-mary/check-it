import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SectionList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import getImageSrc from "@/utils/getImageSrc";
import { Category, Restaurant } from "@prisma/client";
import { Ionicons } from "@expo/vector-icons";

interface FoodItem {
  id: number;
  name: string;
  img: string;
  categoryId: number;
  category: Category;
  restaurant: Restaurant;
}

interface SectionData {
  title: string;
  data: FoodItem[];
}

const FilteredFoods = () => {
  const router = useRouter();
  const { selectedCategoryIds } = useLocalSearchParams<{
    selectedCategoryIds?: string;
  }>();

  const [sections, setSections] = useState<SectionData[]>([]);
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

        // Group foods by category
        const grouped = data.reduce((acc: Record<string, FoodItem[]>, food) => {
          const categoryName = food.category.name;
          if (!acc[categoryName]) {
            acc[categoryName] = [];
          }
          acc[categoryName].push(food);
          return acc;
        }, {});

        // Convert to section list format
        const sectionData = Object.entries(grouped).map(([title, data]) => ({
          title,
          data,
        }));

        setSections(sectionData);
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
      {sections.length > 0 ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/dish/${item.id}`)}
            >
              <View style={styles.cardContent}>
                <Image source={getImageSrc(item.img)} style={styles.image} />
                <View style={styles.textContainer}>
                  <Text style={styles.foodName}>{item.name}</Text>
                  <Text style={styles.restaurantName}>
                    {item.restaurant.name}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={Colors.medium}
                />
              </View>
            </TouchableOpacity>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={styles.noResults}>No matching foods found</Text>
      )}

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
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: Colors.warning,
    fontSize: 16,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.mediumDark,
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 14,
    color: Colors.mediumDark,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
    padding: 16,
    backgroundColor: Colors.lightGrey,
  },
  backButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  backText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  noResults: {
    flex: 1,
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: Colors.mediumDark,
  },
  listContent: {
    paddingBottom: 100,
  },
});

export default FilteredFoods;
