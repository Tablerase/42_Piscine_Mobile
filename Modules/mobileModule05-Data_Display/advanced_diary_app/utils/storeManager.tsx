import * as SecureStore from "expo-secure-store";
import { Provider } from "./AuthProvider";

// Store auth credentials securely
export const storeAuthCredentials = async (
  refreshToken: string,
  providerType: Provider
) => {
  try {
    await SecureStore.setItemAsync("auth_refresh_token", refreshToken);
    await SecureStore.setItemAsync("auth_provider", providerType);
    console.log("Auth credentials stored securely");
  } catch (error) {
    console.error("Error storing auth credentials:", error);
  }
};

// Retrieve stored auth credentials
export const getStoredAuthCredentials = async () => {
  try {
    const refreshToken = await SecureStore.getItemAsync("auth_refresh_token");
    const storedProvider = (await SecureStore.getItemAsync(
      "auth_provider"
    )) as Provider;
    return { refreshToken, provider: storedProvider };
  } catch (error) {
    console.error("Error retrieving auth credentials:", error);
    return { refreshToken: null, provider: null };
  }
};

// Clear stored auth credentials
export const clearStoredAuthCredentials = async () => {
  try {
    await SecureStore.deleteItemAsync("auth_refresh_token");
    await SecureStore.deleteItemAsync("auth_provider");
    console.log("Auth credentials cleared");
  } catch (error) {
    console.error("Error clearing auth credentials:", error);
  }
};
