import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Insert Restaurants
  const restaurants = await prisma.restaurant.createMany({
    data: [
      {
        name: "Healthy Bites",
        location: "Makati",
        rating: 4.5,
        ratingsCount: 200,
        img: "/assets/images/restaurants/healthy_bites.jpg",
        distance: 1.2,
        deliveryTime: 30,
        about: "A place for fresh and healthy meals.",
      },
      {
        name: "Fit Fuel",
        location: "Makati",
        rating: 4.3,
        ratingsCount: 150,
        img: "/assets/images/restaurants/fit_fuel.jpg",
        distance: 2.0,
        deliveryTime: 25,
        about: "Fuel your body with nutritious meals.",
      },
      {
        name: "Gains Grill",
        location: "Makati",
        rating: 4.7,
        ratingsCount: 300,
        img: "/assets/images/restaurants/gains_grill.jpg",
        distance: 1.9,
        deliveryTime: 45,
        about: "High-protein grilled dishes.",
      },
      {
        name: "Lean Kitchen",
        location: "Makati",
        rating: 4.6,
        ratingsCount: 250,
        img: "/assets/images/restaurants/lean_kitchen.jpg",
        distance: 1.8,
        deliveryTime: 28,
        about: "Balanced meals for fitness enthusiasts.",
      },
      {
        name: "Protein Palace",
        location: "Makati",
        rating: 4.8,
        ratingsCount: 180,
        img: "/assets/images/restaurants/protein_palace.jpg",
        distance: 2.1,
        deliveryTime: 55,
        about: "Protein-packed dishes for gains.",
      },
      {
        name: "Muscle Meals",
        location: "Makati",
        rating: 4.4,
        ratingsCount: 220,
        img: "/assets/images/restaurants/muscle_meals.jpg",
        distance: 2.5,
        deliveryTime: 32,
        about: "Healthy meal prep and nutrition.",
      },
      {
        name: "Calorie Cutters",
        location: "Makati",
        rating: 4.2,
        ratingsCount: 140,
        img: "/assets/images/restaurants/calorie_cutters.jpg",
        distance: 3.0,
        deliveryTime: 27,
        about: "Low-calorie, high-protein options.",
      },
      {
        name: "Shred Cafe",
        location: "Makati",
        rating: 4.5,
        ratingsCount: 175,
        img: "/assets/images/restaurants/shred_cafe.jpg",
        distance: 1.7,
        deliveryTime: 33,
        about: "Light and lean meal selections.",
      },
      {
        name: "Balanced Bowls",
        location: "Makati",
        rating: 4.6,
        ratingsCount: 210,
        img: "/assets/images/restaurants/balanced_bowls.jpg",
        distance: 1.9,
        deliveryTime: 29,
        about: "Perfectly balanced macro meals.",
      },
      {
        name: "NutriFeast",
        location: "Makati",
        rating: 4.7,
        ratingsCount: 195,
        img: "/assets/images/restaurants/nutri_feast.jpg",
        distance: 2.2,
        deliveryTime: 31,
        about: "Tasty and nutritious meals.",
      },
    ],
  });

  // Insert Categories
  const categories = await prisma.category.createMany({
    data: [
      { name: "Salads", img: "/assets/images/categories/salads.jpg" },
      {
        name: "Wraps & Sandwiches",
        img: "/assets/images/categories/wraps_and_sandwiches.jpg",
      },
      {
        name: "Rice & Grain Bowls",
        img: "/assets/images/categories/rice_and_grain_bowls.jpg",
      },
      {
        name: "Smoothies & Shakes",
        img: "/assets/images/categories/smoothies_and_shakes.jpg",
      },
      {
        name: "Breakfast & Pancakes",
        img: "/assets/images/categories/breakfast_and_pancakes.jpg",
      },
      {
        name: "High-Protein Meals",
        img: "/assets/images/categories/high-protein_meals.jpg",
      },
      {
        name: "Vegetarian & Vegan",
        img: "/assets/images/categories/vegetarian_and_vegan.jpg",
      },
      { name: "Seafood", img: "/assets/images/categories/seafood.jpg" },
      {
        name: "Healthy Snacks",
        img: "/assets/images/categories/healthy_snacks.jpg",
      },
    ],
  });

  //Insert Food
  const food = await prisma.food.createMany({
    data: [
      //Healthy Bites
      {
        name: "Grilled Chicken Salad",
        categoryId: 1,
        price: 250.0,
        description:
          "Fresh greens with grilled chicken, cherry tomatoes, and vinaigrette.",
        img: "/assets/images/food/grilled_chicken_salad.jpg",
        restaurantId: 1,
        calories: 350,
        protein: 40,
        carbs: 20,
        fat: 10,
      },
      {
        name: "Salmon Bowl",
        categoryId: 3,
        price: 320.0,
        description: "Brown rice with grilled salmon and steamed vegetables.",
        img: "/assets/images/food/salmon_bowl.jpg",
        restaurantId: 1,
        calories: 500,
        protein: 45,
        carbs: 30,
        fat: 15,
      },
      {
        name: "Avocado Toast",
        categoryId: 2,
        price: 200.0,
        description:
          "Whole grain toast topped with mashed avocado and poached egg.",
        img: "/assets/images/food/avocado_toast.jpg",
        restaurantId: 1,
        calories: 300,
        protein: 10,
        carbs: 35,
        fat: 12,
      },
      {
        name: "Quinoa Power Bowl",
        categoryId: 3,
        price: 270.0,
        description:
          "Quinoa with roasted chickpeas, spinach, and tahini dressing.",
        img: "/assets/images/food/quinoa_power_bowl.jpg",
        restaurantId: 1,
        calories: 400,
        protein: 20,
        carbs: 50,
        fat: 8,
      },
      {
        name: "Protein Smoothie",
        categoryId: 4,
        price: 180.0,
        description: "Banana and peanut butter smoothie with whey protein.",
        img: "/assets/images/food/protein_smoothie.jpg",
        restaurantId: 1,
        calories: 250,
        protein: 25,
        carbs: 30,
        fat: 5,
      },

      //Fit Fuel
      {
        name: "Turkey Wrap",
        categoryId: 2,
        price: 220.0,
        description:
          "Whole wheat wrap with turkey, lettuce, and yogurt dressing.",
        img: "/assets/images/food/turkey_wrap.jpg",
        restaurantId: 2,
        calories: 450,
        protein: 35,
        carbs: 40,
        fat: 12,
      },
      {
        name: "Egg White Omelette",
        categoryId: 5,
        price: 180.0,
        description: "Fluffy egg white omelette with spinach and mushrooms.",
        img: "/assets/images/food/egg_white_omelette.jpg",
        restaurantId: 2,
        calories: 320,
        protein: 30,
        carbs: 15,
        fat: 8,
      },
      {
        name: "Brown Rice Chicken",
        categoryId: 3,
        price: 300.0,
        description: "Brown rice with grilled chicken and steamed vegetables.",
        img: "/assets/images/food/brown_rice_chicken.jpg",
        restaurantId: 2,
        calories: 480,
        protein: 50,
        carbs: 55,
        fat: 10,
      },
      {
        name: "Kale Chicken Caesar",
        categoryId: 1,
        price: 250.0,
        description:
          "Kale salad with grilled chicken and homemade caesar dressing.",
        img: "/assets/images/food/kale_chicken_caesar.jpg",
        restaurantId: 2,
        calories: 350,
        protein: 42,
        carbs: 20,
        fat: 9,
      },
      {
        name: "Greek Yogurt Parfait",
        categoryId: 4,
        price: 190.0,
        description: "Greek yogurt with mixed berries and granola.",
        img: "/assets/images/food/greek_yogurt_parfait.jpg",
        restaurantId: 2,
        calories: 280,
        protein: 15,
        carbs: 40,
        fat: 5,
      },

      // Gains Grill
      {
        name: "Steak and Sweet Potato",
        categoryId: 6,
        price: 350.0,
        description: "Grilled lean steak served with mashed sweet potatoes.",
        img: "/assets/images/food/steak_sweet_potato.jpg",
        restaurantId: 3,
        calories: 600,
        protein: 55,
        carbs: 50,
        fat: 15,
      },
      {
        name: "High-Protein Pancakes",
        categoryId: 5,
        price: 200.0,
        description: "Whole grain pancakes packed with whey protein.",
        img: "/assets/images/food/high_protein_pancakes.jpg",
        restaurantId: 3,
        calories: 400,
        protein: 35,
        carbs: 45,
        fat: 8,
      },
      {
        name: "Chicken Alfredo",
        categoryId: 6,
        price: 320.0,
        description: "Creamy alfredo pasta with grilled chicken.",
        img: "/assets/images/food/chicken_alfredo.jpg",
        restaurantId: 3,
        calories: 550,
        protein: 48,
        carbs: 55,
        fat: 12,
      },
      {
        name: "Oatmeal with Almonds",
        categoryId: 5,
        price: 180.0,
        description: "Warm oatmeal topped with almonds and honey.",
        img: "/assets/images/food/oatmeal_almonds.jpg",
        restaurantId: 3,
        calories: 350,
        protein: 15,
        carbs: 50,
        fat: 10,
      },
      {
        name: "Egg and Turkey Bacon",
        categoryId: 5,
        price: 220.0,
        description: "Scrambled eggs with turkey bacon and whole wheat toast.",
        img: "/assets/images/food/egg_turkey_bacon.jpg",
        restaurantId: 3,
        calories: 320,
        protein: 30,
        carbs: 15,
        fat: 8,
      },

      // Lean Kitchen
      {
        name: "Tofu Stir Fry",
        categoryId: 7,
        price: 250.0,
        description: "Stir-fried tofu with mixed vegetables and soy sauce.",
        img: "/assets/images/food/tofu_stir_fry.jpg",
        restaurantId: 4,
        calories: 400,
        protein: 25,
        carbs: 45,
        fat: 10,
      },
      {
        name: "Salmon Avocado Bowl",
        categoryId: 3,
        price: 350.0,
        description: "Brown rice with grilled salmon, avocado, and edamame.",
        img: "/assets/images/food/salmon_avocado_bowl.jpg",
        restaurantId: 4,
        calories: 520,
        protein: 48,
        carbs: 30,
        fat: 18,
      },
      {
        name: "Veggie Wrap",
        categoryId: 2,
        price: 230.0,
        description: "Whole wheat wrap with grilled vegetables and hummus.",
        img: "/assets/images/food/veggie_wrap.jpg",
        restaurantId: 4,
        calories: 300,
        protein: 15,
        carbs: 40,
        fat: 8,
      },
      {
        name: "Lean Beef Rice Bowl",
        categoryId: 6,
        price: 320.0,
        description: "Brown rice topped with lean beef stir fry.",
        img: "/assets/images/food/lean_beef_rice_bowl.jpg",
        restaurantId: 4,
        calories: 450,
        protein: 50,
        carbs: 50,
        fat: 10,
      },
      {
        name: "Banana Protein Shake",
        categoryId: 4,
        price: 180.0,
        description: "Banana smoothie with whey protein and almond milk.",
        img: "/assets/images/food/banana_protein_shake.jpg",
        restaurantId: 4,
        calories: 270,
        protein: 20,
        carbs: 35,
        fat: 5,
      },

      // Protein Palace
      {
        name: "Grilled Chicken Breast",
        categoryId: 6,
        price: 280.0,
        description: "Tender grilled chicken breast served with quinoa.",
        img: "/assets/images/food/grilled_chicken_breast.jpg",
        restaurantId: 5,
        calories: 400,
        protein: 55,
        carbs: 20,
        fat: 10,
      },
      {
        name: "Chocolate Protein Shake",
        categoryId: 4,
        price: 150.0,
        description: "Rich chocolate protein shake made with almond milk.",
        img: "/assets/images/food/chocolate_protein_shake.jpg",
        restaurantId: 5,
        calories: 300,
        protein: 25,
        carbs: 35,
        fat: 5,
      },
      {
        name: "Lean Beef Burger",
        categoryId: 6,
        price: 320.0,
        description: "Whole wheat bun with lean beef patty and lettuce.",
        img: "/assets/images/food/lean_beef_burger.jpg",
        restaurantId: 5,
        calories: 500,
        protein: 50,
        carbs: 40,
        fat: 15,
      },
      {
        name: "Protein Oatmeal",
        categoryId: 5,
        price: 200.0,
        description: "Oatmeal infused with whey protein and peanut butter.",
        img: "/assets/images/food/protein_oatmeal.jpg",
        restaurantId: 5,
        calories: 350,
        protein: 25,
        carbs: 50,
        fat: 8,
      },
      {
        name: "Egg and Avocado Toast",
        categoryId: 2,
        price: 210.0,
        description: "Whole grain toast with avocado and poached eggs.",
        img: "/assets/images/food/egg_avocado_toast.jpg",
        restaurantId: 5,
        calories: 350,
        protein: 20,
        carbs: 30,
        fat: 12,
      },

      // Muscle Meals
      {
        name: "Chicken and Rice",
        categoryId: 3,
        price: 300.0,
        description: "Brown rice with grilled chicken and steamed vegetables.",
        img: "/assets/images/food/chicken_rice.jpg",
        restaurantId: 6,
        calories: 500,
        protein: 55,
        carbs: 60,
        fat: 10,
      },
      {
        name: "Protein Brownie",
        categoryId: 9,
        price: 180.0,
        description: "Guilt-free protein brownie with dark chocolate.",
        img: "/assets/images/food/protein_brownie.jpg",
        restaurantId: 6,
        calories: 280,
        protein: 20,
        carbs: 40,
        fat: 5,
      },
      {
        name: "Lean Meatballs with Quinoa",
        categoryId: 6,
        price: 320.0,
        description: "Baked lean meatballs served with quinoa.",
        img: "/assets/images/food/lean_meatballs_quinoa.jpg",
        restaurantId: 6,
        calories: 450,
        protein: 48,
        carbs: 35,
        fat: 12,
      },
      {
        name: "Salmon with Steamed Broccoli",
        categoryId: 3,
        price: 350.0,
        description: "Grilled salmon served with broccoli and lemon butter.",
        img: "/assets/images/food/salmon_broccoli.jpg",
        restaurantId: 6,
        calories: 520,
        protein: 50,
        carbs: 25,
        fat: 18,
      },
      {
        name: "Cottage Cheese Pancakes",
        categoryId: 5,
        price: 220.0,
        description: "Low-fat pancakes made with cottage cheese and oats.",
        img: "/assets/images/food/cottage_cheese_pancakes.jpg",
        restaurantId: 6,
        calories: 380,
        protein: 30,
        carbs: 45,
        fat: 6,
      },

      // Calorie Cutters
      {
        name: "Salad with Grilled Tofu",
        categoryId: 1,
        price: 220.0,
        description:
          "Fresh salad topped with grilled tofu and sesame dressing.",
        img: "/assets/images/food/salad_grilled_tofu.jpg",
        restaurantId: 7,
        calories: 300,
        protein: 20,
        carbs: 30,
        fat: 8,
      },
      {
        name: "Egg and Oats Breakfast",
        categoryId: 5,
        price: 180.0,
        description: "Scrambled eggs served with warm oatmeal.",
        img: "/assets/images/food/egg_oats.jpg",
        restaurantId: 7,
        calories: 370,
        protein: 30,
        carbs: 45,
        fat: 10,
      },
      {
        name: "Zucchini Noodles with Chicken",
        categoryId: 7,
        price: 250.0,
        description: "Zucchini noodles served with grilled chicken and pesto.",
        img: "/assets/images/food/zucchini_noodles_chicken.jpg",
        restaurantId: 7,
        calories: 340,
        protein: 40,
        carbs: 20,
        fat: 12,
      },
      {
        name: "Vegan Protein Smoothie",
        categoryId: 4,
        price: 190.0,
        description: "Smoothie made with plant-based protein and almond milk.",
        img: "/assets/images/food/vegan_protein_smoothie.jpg",
        restaurantId: 7,
        calories: 280,
        protein: 22,
        carbs: 30,
        fat: 6,
      },
      {
        name: "Baked Sweet Potato Fries",
        categoryId: 9,
        price: 160.0,
        description: "Crispy baked sweet potato fries with sea salt.",
        img: "/assets/images/food/baked_sweet_potato_fries.jpg",
        restaurantId: 7,
        calories: 280,
        protein: 5,
        carbs: 50,
        fat: 6,
      },

      // Shred Cafe
      {
        name: "Steamed Fish and Rice",
        categoryId: 3,
        price: 320.0,
        description:
          "Lightly steamed fish served with brown rice and vegetables.",
        img: "/assets/images/food/steamed_fish_rice.jpg",
        restaurantId: 8,
        calories: 500,
        protein: 45,
        carbs: 50,
        fat: 15,
      },
      {
        name: "Protein Waffles",
        categoryId: 5,
        price: 220.0,
        description: "Crispy waffles made with whey protein and almond flour.",
        img: "/assets/images/food/protein_waffles.jpg",
        restaurantId: 8,
        calories: 320,
        protein: 30,
        carbs: 40,
        fat: 8,
      },
      {
        name: "Tuna Avocado Wrap",
        categoryId: 2,
        price: 230.0,
        description: "Whole wheat wrap with tuna, avocado, and lettuce.",
        img: "/assets/images/food/tuna_avocado_wrap.jpg",
        restaurantId: 8,
        calories: 380,
        protein: 42,
        carbs: 35,
        fat: 10,
      },
      {
        name: "Chia Pudding",
        categoryId: 4,
        price: 190.0,
        description: "Chia seed pudding with almond milk and fresh berries.",
        img: "/assets/images/food/chia_pudding.jpg",
        restaurantId: 8,
        calories: 270,
        protein: 12,
        carbs: 30,
        fat: 7,
      },
      {
        name: "Grilled Shrimp Quinoa Bowl",
        categoryId: 3,
        price: 340.0,
        description: "Grilled shrimp with quinoa and roasted vegetables.",
        img: "/assets/images/food/grilled_shrimp_quinoa.jpg",
        restaurantId: 8,
        calories: 480,
        protein: 45,
        carbs: 40,
        fat: 12,
      },
      // Balanced Bowls
      {
        name: "Lean Turkey Rice",
        categoryId: 3,
        price: 300.0,
        description:
          "Ground turkey with jasmine rice and stir-fried vegetables.",
        img: "/assets/images/food/lean_turkey_rice.jpg",
        restaurantId: 9,
        calories: 450,
        protein: 55,
        carbs: 50,
        fat: 10,
      },
      {
        name: "Beef Stir Fry",
        categoryId: 6,
        price: 320.0,
        description:
          "Lean beef strips stir-fried with bell peppers and onions.",
        img: "/assets/images/food/beef_stir_fry.jpg",
        restaurantId: 9,
        calories: 500,
        protein: 55,
        carbs: 45,
        fat: 12,
      },
      {
        name: "Quinoa and Black Bean Bowl",
        categoryId: 3,
        price: 280.0,
        description: "Quinoa with black beans, corn, and avocado.",
        img: "/assets/images/food/quinoa_black_bean_bowl.jpg",
        restaurantId: 9,
        calories: 400,
        protein: 20,
        carbs: 50,
        fat: 8,
      },
      {
        name: "Grilled Chicken Caesar Salad",
        categoryId: 1,
        price: 260.0,
        description:
          "Crisp romaine lettuce with grilled chicken and Caesar dressing.",
        img: "/assets/images/food/grilled_chicken_caesar_salad.jpg",
        restaurantId: 9,
        calories: 350,
        protein: 40,
        carbs: 15,
        fat: 12,
      },
      {
        name: "Tofu Buddha Bowl",
        categoryId: 3,
        price: 290.0,
        description: "Brown rice with tofu, chickpeas, and mixed greens.",
        img: "/assets/images/food/tofu_buddha_bowl.jpg",
        restaurantId: 9,
        calories: 420,
        protein: 28,
        carbs: 55,
        fat: 10,
      },

      // NutriFeast
      {
        name: "Chicken Avocado Wrap",
        categoryId: 2,
        price: 280.0,
        description: "Grilled chicken with avocado in a whole wheat wrap.",
        img: "/assets/images/food/chicken_avocado_wrap.jpg",
        restaurantId: 10,
        calories: 450,
        protein: 50,
        carbs: 40,
        fat: 12,
      },
      {
        name: "Mango Protein Shake",
        categoryId: 4,
        price: 160.0,
        description: "Smoothie blend of mango, yogurt, and whey protein.",
        img: "/assets/images/food/mango_protein_shake.jpg",
        restaurantId: 10,
        calories: 300,
        protein: 25,
        carbs: 35,
        fat: 5,
      },
      {
        name: "Baked Salmon with Asparagus",
        categoryId: 3,
        price: 350.0,
        description: "Oven-baked salmon served with asparagus and lemon.",
        img: "/assets/images/food/baked_salmon_asparagus.jpg",
        restaurantId: 10,
        calories: 500,
        protein: 48,
        carbs: 25,
        fat: 18,
      },
      {
        name: "Almond Butter Oatmeal",
        categoryId: 5,
        price: 210.0,
        description: "Oatmeal topped with almond butter and banana slices.",
        img: "/assets/images/food/almond_butter_oatmeal.jpg",
        restaurantId: 10,
        calories: 380,
        protein: 15,
        carbs: 50,
        fat: 10,
      },
      {
        name: "Spicy Chickpea Wrap",
        categoryId: 2,
        price: 250.0,
        description:
          "Whole wheat wrap with spiced chickpeas and fresh veggies.",
        img: "/assets/images/food/spicy_chickpea_wrap.jpg",
        restaurantId: 10,
        calories: 370,
        protein: 18,
        carbs: 45,
        fat: 9,
      },
    ],
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
