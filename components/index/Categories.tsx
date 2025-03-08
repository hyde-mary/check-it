import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import React from "react";
import getImageSource from "@/utils/getImageSrc";
import { Category } from "@prisma/client";

type CategoriesDataType = {
  id: string;
  name: string;
  img: string;
};

const Categories = ({ categories }: { categories: Category[] }) => {
  if (!categories) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        alignItems: "center",
      }}
    >
      {categories.map((category: Category) => (
        <View style={styles.categoryCard} key={category.id}>
          <Image
            source={getImageSource(category.img)}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.categoryText} numberOfLines={2}>
            {category.name}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  categoryCard: {
    width: 100,
    alignItems: "center",
    marginRight: 10,
  },
  categoryText: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 5,
    width: 80,
    minHeight: 35,
  },
});

export default Categories;
