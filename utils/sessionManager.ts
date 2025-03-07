import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@prisma/client";

const TOKEN_KEY = "authToken";
const USER_INFO_KEY = "userInfo";

// use this to save the token
export const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

// use this to get the token
export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

// removing tokens
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

// check if authenticated si user
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getToken();
  return token !== null;
};

// save user info
export const saveUserInfo = async (userInfo: object) => {
  try {
    const jsonValue = JSON.stringify(userInfo);
    await AsyncStorage.setItem(USER_INFO_KEY, jsonValue);
  } catch (error) {
    console.error("Error saving user info:", error);
  }
};

// get user info
export const getUserInfo = async (): Promise<Omit<User, "password"> | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_INFO_KEY);
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error("Error retrieving user info:", error);
    return null;
  }
};

// remove user info
export const removeUserInfo = async () => {
  try {
    await AsyncStorage.removeItem(USER_INFO_KEY);
  } catch (error) {
    console.error("Error removing user info:", error);
  }
};
