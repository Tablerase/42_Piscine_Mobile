import {
  getRedirectResult,
  GithubAuthProvider,
  signInWithRedirect,
} from "firebase/auth";
import { auth } from "./firebaseConfig";

const provider = new GithubAuthProvider();

// Add scopes if needed
provider.addScope("user:email");

export const signInWithGithub = async () => {
  try {
    // For React Native, use redirect instead of popup
    await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error("GitHub sign in error:", error);
    throw error;
  }
};

// Handle redirect result (call this in your app initialization)
export const handleAuthRedirect = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;

      console.log("GitHub token:", token);
      console.log("GitHub user:", user);

      return { user, token };
    }
  } catch (error) {
    console.error("Auth redirect error:", error);
    throw error;
  }
};
