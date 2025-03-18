import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../../constants/Colors";
import { router, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import getImageSrc from "@/utils/getImageSrc";

interface Category {
  id: number;
  img: string;
  name: string;
  checked?: boolean;
}

const { width } = Dimensions.get("window");
const CARD_SIZE = width * 0.9;

const FilterHeader = () => (
  <View style={styles.headerContainer}>
    <Text style={styles.title}>Filter Options</Text>
    <View style={styles.filterControls}>
      {[
        { icon: "swap-vertical", label: "Sort" },
        { icon: "funnel", label: "Filters" },
        { icon: "refresh", label: "Reset" },
      ].map((item) => (
        <TouchableOpacity key={item.label} style={styles.controlButton}>
          <Ionicons name={item.icon as any} size={20} color={Colors.primary} />
          <Text style={styles.controlText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const Filter = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://10.0.2.2:3000/api/categories/", {
          signal: abortController.signal,
        });

        if (!response.ok)
          throw new Error(`Failed to fetch: ${response.status}`);

        const data: Category[] = await response.json();
        setCategories(data.map((item) => ({ ...item, checked: false })));
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load categories");
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();
    return () => abortController.abort();
  }, []);

  const handleToggle = (id: number) => {
    setCategories((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const selectedCount = categories.filter((item) => item.checked).length;

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
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => setLoading(true)}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.checkboxContainer}>
              <BouncyCheckbox
                isChecked={item.checked}
                fillColor={Colors.primary}
                unFillColor="#FFFFFF"
                iconStyle={{
                  borderColor: Colors.primary,
                  borderRadius: 4,
                  borderWidth: 2,
                }}
                innerIconStyle={{
                  borderColor: Colors.primary,
                  borderRadius: 4,
                }}
                onPress={() => handleToggle(item.id)}
              />
            </View>

            <Text style={styles.categoryName}>{item.name}</Text>

            <Image
              source={getImageSrc(item.img)}
              style={styles.categoryImage}
              accessibilityLabel={item.name}
            />
          </View>
        )}
        ListHeaderComponent={<FilterHeader />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={[styles.footer]}>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() =>
            setCategories((prev) =>
              prev.map((item) => ({ ...item, checked: false }))
            )
          }
        >
          <Text style={styles.clearText}>
            Clear Selections ({selectedCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => {
            const selectedCategoryIds = categories
              .filter((item) => item.checked)
              .map((item) => item.id)
              .join(",");

            router.push(
              `/(filter)/filtered-foods?selectedCategoryIds=${selectedCategoryIds}`
            );
          }}
        >
          <Text style={styles.doneText}>Apply Filters</Text>
          <Ionicons name="checkmark-circle" size={20} color="white" />
        </TouchableOpacity>
      </View>
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
    padding: 20,
  },
  error: {
    color: Colors.warning,
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  headerContainer: {
    paddingVertical: 24,
    backgroundColor: "white",
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.mediumDark,
    textAlign: "center",
    marginBottom: 20,
  },
  filterControls: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  controlButton: {
    alignItems: "center",
    padding: 10,
  },
  controlText: {
    color: Colors.mediumDark,
    fontSize: 12,
    marginTop: 6,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryImage: {
    width: 50,
    height: 50,
    resizeMode: "cover",
    borderRadius: 10,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  checkbox: {
    marginRight: 10,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 50,
    elevation: 5,
    overflow: "hidden",
    padding: 10,
  },
  clearButton: {
    backgroundColor: Colors.lightGrey,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  clearText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  doneButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
  },
  doneText: {
    color: "white",
    fontWeight: "600",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checkboxContainer: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Filter;
