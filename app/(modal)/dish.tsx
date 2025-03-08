import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import getImageSrc from "@/utils/getImageSrc";
import useBasketStore from "@/store/useBasketStore";
import Colors from "@/constants/Colors";

const Dish = () => {
  const { id, name, price, description, img, calories, protein, carbs, fat } =
    useLocalSearchParams();
  const router = useRouter();
  const { addFood } = useBasketStore();

  const addToCart = () => {
    addFood({
      id: Number(id),
      name: name as string,
      price: parseFloat(price as string),
      description: description as string,
      img: img as string,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat),
    });

    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={getImageSrc(Array.isArray(img) ? img[0] : img)}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.dishName}>{name}</Text>
          <Text style={styles.dishDescription}>{description}</Text>

          <View style={styles.nutritionContainer}>
            <NutritionRow label="🔥  Calories" value={calories as string} />
            <NutritionRow label="🥩  Protein" value={`${protein}g`} />
            <NutritionRow label="🍞  Carbs" value={`${carbs}g`} />
            <NutritionRow label="🧈  Fat" value={`${fat}g`} />
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addToCart()}
            activeOpacity={0.9}
          >
            <Ionicons name="cart" size={24} color="white" style={styles.icon} />
            <Text style={styles.buttonText}>
              Add for ₱{parseFloat(price as string).toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const NutritionRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.nutritionRow}>
    <Text style={styles.nutritionLabel}>{label}</Text>
    <Text style={styles.nutritionValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f4f8",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    overflow: "hidden",
  },
  imageContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 320,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 100,
  },
  dishName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: 16,
  },
  dishDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: "#636e72",
    marginBottom: 24,
  },
  nutritionContainer: {
    backgroundColor: "#eaf0f1",
    borderRadius: 16,
    padding: 20,
  },
  nutritionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#dfe6e9",
  },
  nutritionLabel: {
    fontSize: 16,
    color: "#2d3436",
    fontWeight: "500",
  },
  nutritionValue: {
    fontSize: 16,
    color: "#0984e3",
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 10,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 14,
    shadowColor: "#0984e3",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 3,
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

export default Dish;
