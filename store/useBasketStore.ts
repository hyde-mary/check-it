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
}

export interface BasketState {
  foods: Array<Food & { quantity: number }>;
  addFood: (food: Food) => void;
  reduceFood: (food: Food) => void;
  clearCart: () => void;
  items: number;
  total: number;
}

const useBasketStore = create<BasketState>((set) => ({
  foods: [],
  items: 0,
  total: 0,

  addFood: (food) => {
    set((state) => {
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

  reduceFood: (food) => {
    set((state) => {
      const updatedFoods = state.foods
        .map((f) => (f.id === food.id ? { ...f, quantity: f.quantity - 1 } : f))
        .filter((f) => f.quantity > 0);

      return {
        foods: updatedFoods,
        items: state.items - 1,
        total: state.total - food.price,
      };
    });
  },

  clearCart: () => set({ foods: [], items: 0, total: 0 }),
}));

export default useBasketStore;
