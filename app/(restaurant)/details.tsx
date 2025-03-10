import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SectionList,
  ScrollView,
  Animated,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Colors from "@/constants/Colors";
import { Link, router, useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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
  const { items, total } = useBasketStore();

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<TouchableOpacity[]>([]);
  const scrollY = useRef(new Animated.Value(0)).current;

  const animatedStyles = {
    opacity: scrollY.interpolate({
      inputRange: [0, 50, 100],
      outputRange: [0, 0.5, 1],
      extrapolate: "clamp",
    }),
  };

  useEffect(() => {
    setRestaurantData(null);
    setFoodData(null);
    fetchRestaurant();
    fetchRestaurantFood();
  }, [restaurantId]);

  const fetchRestaurant = async () => {
    try {
      const response = await fetch(
        `http://10.0.2.2:3000/api/restaurants/${restaurantId}`
      );

      if (!response.ok) throw new Error("Response not OK");

      setRestaurantData(await response.json());
    } catch (error) {
      console.error("Error fetching restaurant data.", error);
    }
  };

  const fetchRestaurantFood = async () => {
    try {
      const response = await fetch(
        `http://10.0.2.2:3000/api/foods/restaurant/${restaurantId}`
      );

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
          onPress={() => router.replace("/")}
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

  const selectCategory = (index: number) => {
    setActiveIndex(index);

    if (scrollRef.current && itemsRef.current[index]) {
      itemsRef.current[index].measure((x, y, width, height, pageX) => {
        scrollRef.current?.scrollTo({ x: pageX - 16, animated: true });
      });
    }
  };

  if (!restaurantData || !foodData) return <DotsLoader />;

  return (
    <>
      <ParallaxScrollView
        parallaxHeaderHeight={250}
        stickyHeaderHeight={100}
        backgroundColor={"#fff"}
        contentBackgroundColor={Colors.lightGrey}
        fadeOutForeground
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        renderBackground={() => (
          <Image
            source={getImageSrc(restaurantData.img)}
            style={{ height: 300, width: "100%" }}
          />
        )}
        renderStickyHeader={() => (
          <View style={styles.stickyHeader}>
            <Text style={styles.stickyText}>{restaurantData.name}</Text>
          </View>
        )}
      >
        <View style={styles.foreground}>
          <View style={styles.headerContainer}>
            <Text
              style={styles.restaurantName}
              numberOfLines={2}
              accessibilityRole="header"
            >
              {restaurantData.name}
            </Text>

            <View style={styles.detailContainer}>
              <Ionicons name="watch-outline" style={styles.icon} />
              <Text
                style={styles.deliveryTime}
                accessibilityLabel={`Delivery time: ${restaurantData.deliveryTime} minutes`}
              >
                {restaurantData.deliveryTime} min
              </Text>
            </View>
          </View>

          <Text
            style={styles.restaurantDescription}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {restaurantData.about}
          </Text>
        </View>
        <SectionList
          contentContainerStyle={{ paddingBottom: 100 }}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          sections={groupedFoods}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push(`/dish/${item.id}`)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.dish}>{item.name}</Text>
                <Text style={styles.dishText}>{item.description}</Text>
                <View style={styles.nutritionContainer}>
                  <Text style={styles.nutritionText}>₱{item.price}</Text>
                  <Text style={styles.nutritionText}>{item.calories} cal</Text>
                  <Text style={styles.nutritionText}>
                    {item.protein}g protein
                  </Text>
                </View>
              </View>
              <Image source={getImageSrc(item.img)} style={styles.dishImage} />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
        />
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
                ref={(ref) => ref && (itemsRef.current[index] = ref)}
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
  foreground: {
    padding: 16,
    gap: 12,
  },
  headerContainer: {
    gap: 8,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    lineHeight: 28,
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  icon: {
    width: 16,
    height: 16,
    tintColor: "#666",
  },
  deliveryTime: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  restaurantDescription: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    marginTop: 4,
  },
  detailsContainer: {
    backgroundColor: Colors.lightGrey,
  },
  stickySection: {
    backgroundColor: "#fff",
    marginLeft: 10,
    height: 100,
    justifyContent: "flex-end",
  },
  stickyHeader: { height: 100, justifyContent: "center", alignItems: "center" },
  stickyText: { fontSize: 18, fontWeight: "bold" },
  separator: { height: 1, backgroundColor: Colors.grey, marginHorizontal: 16 },
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
