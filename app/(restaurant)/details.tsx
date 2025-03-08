import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SectionList,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Colors from "@/constants/Colors";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import getImageSrc from "@/utils/getImageSrc";
import useBasketStore from "@/store/useBasketStore";
import { Category, Food, Restaurant } from "@prisma/client";
import { DotsLoader } from "@/components/Loading";
import ParallaxScrollView from "@/components/scrolls/ParallaxScrollView";

const Details = () => {
  const navigation = useNavigation();
  const { restaurantId } = useLocalSearchParams();
  const [restaurantData, setRestaurantData] = useState<Restaurant | null>(null);
  const [foodData, setFoodData] = useState<
    (Food & { category: Category })[] | null
  >(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const opacity = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<TouchableOpacity[]>([]);

  const { items, total } = useBasketStore();

  useEffect(() => {
    setRestaurantData(null);
    setFoodData(null);
    fetchRestaurant();
    fetchRestaurantFood();
  }, [restaurantId]);

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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
      headerTintColor: Colors.primary,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.roundButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="share-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="search-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);

    scrollRef.current?.scrollTo({
      x: index * 100,
      animated: true,
    });

    const sectionScroll = groupedFoods[index].index;
  };

  const onScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    if (y > 350) {
      opacity.value = withTiming(1);
    } else {
      opacity.value = withTiming(0);
    }
  };

  const groupedFoods = foodData
    ? foodData.reduce((acc: any[], item) => {
        const existingCategory = acc.find(
          (cat) => cat.title === item.category.name
        );
        if (existingCategory) {
          existingCategory.data.push(item);
        } else {
          acc.push({ title: item.category.name, data: [item] });
        }
        return acc;
      }, [])
    : [];

  if (!restaurantData || !foodData) return <DotsLoader />;

  return (
    <>
      <ParallaxScrollView
        scrollEvent={onScroll}
        backgroundColor={"#fff"}
        style={{ flex: 1, paddingBottom: 42 }}
        parallaxHeaderHeight={250}
        stickyHeaderHeight={100}
        renderBackground={() => (
          <Image
            source={getImageSrc(restaurantData.img)}
            style={{ height: 300, width: "100%" }}
          />
        )}
        contentBackgroundColor={Colors.lightGrey}
        renderStickyHeader={() => (
          <View key="sticky-header" style={styles.stickySection}>
            <Text style={styles.stickySectionText}>{restaurantData.name}</Text>
          </View>
        )}
      >
        <View style={styles.detailsContainer}>
          <Text style={styles.restaurantName}>{restaurantData.name}</Text>
          <Text style={styles.restaurantDescription}>
            Delivery Time: {restaurantData.deliveryTime} minutes
          </Text>
          <Text style={styles.restaurantDescription}>
            {restaurantData.about}
          </Text>
          <SectionList
            contentContainerStyle={{ paddingBottom: 50 }}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            sections={groupedFoods}
            renderItem={({ item }) => (
              <Link
                href={{
                  pathname: "/(modal)/dish",
                  params: {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    img: item.img,
                    price: item.price,
                    calories: item.calories,
                    protein: item.protein,
                    carbs: item.carbs,
                    fat: item.fat,
                  },
                }}
                asChild
              >
                <TouchableOpacity style={styles.item}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.dish}>{item.name}</Text>
                    <Text style={styles.dishText}>{item.description}</Text>
                    <View style={styles.nutritionContainer}>
                      <Text style={styles.nutritionText}>₱{item.price}</Text>
                      <Text style={styles.nutritionText}>
                        {item.calories} cal
                      </Text>
                      <Text style={styles.nutritionText}>
                        {item.protein}g protein
                      </Text>
                    </View>
                  </View>
                  <Image
                    source={getImageSrc(item.img)}
                    style={styles.dishImage}
                  />
                </TouchableOpacity>
              </Link>
            )}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  marginHorizontal: 16,
                  height: 1,
                  backgroundColor: Colors.grey,
                }}
              />
            )}
            SectionSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: Colors.grey }} />
            )}
            renderSectionHeader={({ section: { title, index } }) => (
              <Text style={styles.sectionHeader}>{title}</Text>
            )}
          />
        </View>
      </ParallaxScrollView>

      {/* Sticky segments */}
      <Animated.View style={[styles.stickySegments, animatedStyles]}>
        <View style={styles.segmentsShadow}>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.segmentScrollview}
          >
            {groupedFoods.map((category, index) => (
              <TouchableOpacity
                ref={(ref) => (itemsRef.current[index] = ref)}
                key={category.title}
                style={
                  activeIndex === index
                    ? styles.segmentButtonActive
                    : styles.segmentButton
                }
                onPress={() => selectCategory(index)}
              >
                <Text
                  style={
                    activeIndex === index
                      ? styles.segmentTextActive
                      : styles.segmentText
                  }
                >
                  {category.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Animated.View>

      {/* Footer Basket */}
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
    </>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    backgroundColor: Colors.lightGrey,
  },
  stickySection: {
    backgroundColor: "#fff",
    marginLeft: 10,
    height: 100,
    justifyContent: "flex-end",
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  stickySectionText: {
    fontSize: 20,
    margin: 10,
  },
  restaurantName: {
    fontSize: 30,
    margin: 16,
  },
  restaurantDescription: {
    fontSize: 16,
    margin: 16,
    lineHeight: 22,
    color: Colors.medium,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.mediumDark,
    marginTop: 32,
    marginBottom: 16,
    marginHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  item: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
    gap: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dishImage: {
    height: 120,
    width: 120,
    borderRadius: 8,
    resizeMode: "cover",
  },
  dish: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.mediumDark,
  },
  dishText: {
    fontSize: 14,
    color: Colors.mediumDark,
    lineHeight: 20,
    marginVertical: 6,
  },
  stickySegments: {
    position: "absolute",
    height: 50,
    left: 0,
    right: 0,
    top: 100,
    backgroundColor: "#fff",
    overflow: "hidden",
    paddingBottom: 4,
  },
  segmentsShadow: {
    backgroundColor: "#fff",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
    height: "100%",
  },
  segmentButton: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 50,
  },
  segmentText: {
    color: Colors.primary,
    fontSize: 16,
  },
  segmentButtonActive: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 50,
  },
  segmentTextActive: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  segmentScrollview: {
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 20,
    paddingBottom: 4,
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
  nutritionContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    flexWrap: "wrap",
  },
  nutritionText: {
    fontSize: 13,
    color: Colors.mediumDark,
    backgroundColor: Colors.lightGrey,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
});

export default Details;
