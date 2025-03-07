import { create } from "zustand";

type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthday: string;
  height: number;
  weight: number;
  gender: string;
  activityLevel: string;
  goals: string;
};

interface RegisterState {
  userData: Partial<UserData>;
  updateUserData: (data: Partial<UserData>) => void;
  resetUserData: () => void;
  getUserData: () => Partial<UserData>;
}

export const useRegisterStore = create<RegisterState>((set, get) => ({
  userData: {},

  updateUserData: (data) =>
    set((state) => ({ userData: { ...state.userData, ...data } })),

  resetUserData: () => set({ userData: {} }),

  getUserData: () => get().userData,
}));
