import { create } from "zustand";

export interface Food {
  id: number;
  name: string;
  price: number;
  description: string;
  img: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  restaurantId: number;
}

export interface BasketState {
  foods: Array<Food & { quantity: number }>;
  addFood: (food: Food) => void;
  increaseFood: (food: Food) => void;
  reduceFood: (food: Food) => void;
  clearFood: (food: Food) => void;
  clearBasket: () => void;
  items: number;
  total: number;
}

const useBasketStore = create<BasketState>((set) => ({
  foods: [],
  items: 0,
  total: 0,

  addFood: (food) => {
    set((state) => {
      if (state.foods.length > 0) {
        const currentRestaurantId = state.foods[0].restaurantId;
        if (food.restaurantId !== currentRestaurantId) {
          alert("You can only order from one restaurant at a time.");
          return state; // Don't modify state
        }
      }

      const existingFood = state.foods.find((f) => f.id === food.id);

      if (existingFood) {
        return {
          foods: state.foods.map((f) =>
            f.id === food.id ? { ...f, quantity: f.quantity + 1 } : f
          ),
          items: state.items + 1,
          total: state.total + food.price,
        };
      } else {
        return {
          foods: [...state.foods, { ...food, quantity: 1 }],
          items: state.items + 1,
          total: state.total + food.price,
        };
      }
    });
  },

  increaseFood: (food) => {
    set((state) => ({
      foods: state.foods.map((f) =>
        f.id === food.id ? { ...f, quantity: f.quantity + 1 } : f
      ),
      items: state.items + 1,
      total: state.total + food.price,
    }));
  },

  reduceFood: (food) => {
    set((state) => {
      const updatedFoods = state.foods
        .map((f) => (f.id === food.id ? { ...f, quantity: f.quantity - 1 } : f))
        .filter((f) => f.quantity > 0);

      return {
        foods: updatedFoods,
        items: Math.max(0, state.items - 1),
        total: Math.max(0, state.total - food.price),
      };
    });
  },

  clearFood: (food) => {
    set((state) => {
      const foodToRemove = state.foods.find((f) => f.id === food.id);

      if (!foodToRemove) return state;

      const updatedFoods = state.foods.filter((f) => f.id !== food.id);

      return {
        foods: updatedFoods,
        items: Math.max(0, state.items - foodToRemove.quantity),
        total: Math.max(
          0,
          state.total - foodToRemove.quantity * foodToRemove.price
        ),
      };
    });
  },

  clearBasket: () =>
    set({
      foods: [],
      items: 0,
      total: 0,
    }),
}));

export default useBasketStore;
