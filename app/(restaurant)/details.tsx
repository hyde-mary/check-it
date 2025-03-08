import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  LayoutChangeEvent,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Colors from "@/constants/Colors";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import getImageSrc from "@/utils/getImageSrc";
import useBasketStore from "@/store/useBasketStore";
import { Food, Restaurant } from "@prisma/client";
import { DotsLoader } from "@/components/Loading";
import ParallaxScrollView from "@/components/scrolls/ParallaxScrollView";

const Details = () => {
  const { restaurantId } = useLocalSearchParams();
  const [restaurantData, setRestaurantData] = useState<Restaurant | null>(null);
  const [foodData, setFoodData] = useState<Food[] | null>(null);
  const [groupedFoods, setGroupedFoods] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState(0);
  const [sectionPositions, setSectionPositions] = useState<number[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const { items, total } = useBasketStore();

  useEffect(() => {
    fetchRestaurant();
    fetchRestaurantFood();
  }, []);

  useEffect(() => {
    if (foodData) {
      const grouped = foodData.reduce((acc: any[], item) => {
        const category = acc.find((cat) => cat.title === item.name);
        if (category) {
          category.data.push(item);
        } else {
          acc.push({ title: item.name, data: [item] });
        }
        return acc;
      }, []);
      setGroupedFoods(grouped);
    }
  }, [foodData]);

  const fetchRestaurantFood = async () => {
    try {
      const response = await fetch("http://10.0.2.2:3000/foods/restaurant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId: Number(restaurantId) }),
      });
      if (!response.ok) throw new Error("Response not OK");
      setFoodData(await response.json());
    } catch (error) {
      console.error("Error fetching food data.", error);
    }
  };

  const fetchRestaurant = async () => {
    try {
      const response = await fetch("http://10.0.2.2:3000/restaurant/id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: Number(restaurantId) }),
      });
      if (!response.ok) throw new Error("Response not OK");
      setRestaurantData(await response.json());
    } catch (error) {
      console.error("Error fetching restaurant data.", error);
    }
  };

  const handleCategoryPress = (index: number) => {
    setActiveCategory(index);
    setTimeout(() => {
      if (sectionPositions[index] !== undefined) {
        scrollRef.current?.scrollTo({
          y: sectionPositions[index] - 100,
          animated: true,
        });
      }
    }, 100);
  };

  const handleSectionLayout = (index: number, e: LayoutChangeEvent) => {
    const layout = e.nativeEvent.layout;
    const positions = [...sectionPositions];
    positions[index] = layout.y;
    setSectionPositions(positions);
  };

  const renderStickyHeader = useCallback(
    (scrollY: Animated.SharedValue<number>) => {
      const tabStyle = useAnimatedStyle(() => ({
        transform: [
          {
            translateY: interpolate(scrollY.value, [0, 300], [0, -60], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          },
        ],
      }));

      return (
        <Animated.View style={[styles.stickyHeader, tabStyle]}>
          <ScrollView /* ... */>{/* Tabs content */}</ScrollView>
        </Animated.View>
      );
    },
    [groupedFoods, activeCategory]
  );

  if (!restaurantData || !foodData) return <DotsLoader />;

  return (
    <>
      <ParallaxScrollView
        ref={scrollRef}
        parallaxHeaderHeight={300}
        stickyHeaderHeight={60}
        renderBackground={() => (
          <Image
            source={getImageSrc(restaurantData.img)}
            style={{ height: 300, width: "100%" }}
          />
        )}
        renderStickyHeader={() => (
          <View key="sticky-header" style={styles.stickySection}>
            <Text style={styles.stickySectionText}>{restaurantData.name}</Text>
          </View>
        )}
      >
        <ScrollView
          ref={scrollRef}
          scrollEventThrottle={16}
          onScroll={({ nativeEvent }) => {
            const offsetY = nativeEvent.contentOffset.y;
            const activeIndex = sectionPositions.findIndex(
              (pos) => pos > offsetY + 100
            );
            if (activeIndex !== -1 && activeIndex !== activeCategory) {
              setActiveCategory(activeIndex === -1 ? 0 : activeIndex - 1);
            }
          }}
        >
          <View style={styles.detailsContainer}>
            <Text style={styles.restaurantName}>{restaurantData.name}</Text>
            <Text style={styles.restaurantDescription}>
              {restaurantData.about}
            </Text>

            {groupedFoods.map((category, index) => (
              <View
                key={category.title}
                onLayout={(e) => handleSectionLayout(index, e)}
                style={styles.section}
              >
                <Text style={styles.sectionHeader}>{category.title}</Text>
                {category.data.map((item: Food) => (
                  <TouchableOpacity key={item.id} style={styles.item}>
                    {/* Keep your existing item rendering */}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </ParallaxScrollView>

      {items > 0 && (
        <View style={styles.footer}>
          <SafeAreaView edges={["bottom"]}>
            <TouchableOpacity style={styles.fullButton}>
              <Text style={styles.footerText}>View Basket ({items})</Text>
              <Text style={styles.basketTotal}>₱{total}</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  detailsContainer: { backgroundColor: Colors.lightGrey, padding: 16 },
  restaurantName: { fontSize: 30, fontWeight: "bold", marginBottom: 10 },
  restaurantDescription: {
    fontSize: 16,
    color: Colors.medium,
    marginBottom: 20,
  },
  sectionHeader: { fontSize: 22, fontWeight: "bold", marginVertical: 10 },
  item: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
    marginVertical: 5,
  },
  dishImage: { height: 80, width: 80, borderRadius: 4, resizeMode: "cover" },
  dish: { fontSize: 16, fontWeight: "bold" },
  dishText: { fontSize: 14, color: Colors.mediumDark, paddingVertical: 4 },
  nutritionText: { fontSize: 12, color: Colors.mediumDark, marginTop: 4 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    padding: 10,
    backgroundColor: "#fff",
    elevation: 10,
  },
  fullButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  basketTotal: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  stickyHeader: {
    height: 60,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: Colors.lightGrey,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    color: Colors.mediumDark,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#fff",
  },
  section: {
    marginBottom: 30,
  },
  parallaxHeader: {
    height: 300,
    width: "100%",
    resizeMode: "cover",
  },
  stickySection: {
    backgroundColor: "#fff",
    marginLeft: 70,
    height: 100,
    justifyContent: "flex-end",
  },
  stickySectionText: {
    fontSize: 20,
    margin: 10,
  },
});

export default Details;
