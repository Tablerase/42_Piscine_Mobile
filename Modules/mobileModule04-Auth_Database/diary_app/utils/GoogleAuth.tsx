import { ThemedButtonIcon } from "@/components/ThemedButtonIcon";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
} from "firebase/auth";
import { Provider, useAuthProvider } from "./AuthProvider";
import { auth } from "./firebaseConfig";

export const GoogleAuth = () => {
  const { setProvider, setIsLoading } = useAuthProvider();
  const iconColor = useThemeColor({}, "background");

  const onGoogleButtonPress = async () => {
    try {
      const webClientId = process.env.EXPO_PUBLIC_GOOGLE_FIREBASE_WEB_CLIENT_ID;
      //  Init Google SDK
      GoogleSignin.configure({
        webClientId: webClientId,
      });
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      let idToken;
      // Check google sign in status
      console.log("Google services sign in...");
      const signedIn = GoogleSignin.hasPreviousSignIn();
      if (signedIn) {
        console.log("Google already signed");
        // Recover user data
        signOut(auth);
        GoogleSignin.signOut();
        return;
      } else {
        setIsLoading(true);
        // Get the users ID token
        const signInResult = await GoogleSignin.signIn();
        console.log("Google sign in: ", signInResult);

        idToken = signInResult.data?.idToken;
      }

      console.log("Google token: ", idToken);
      if (!idToken) {
        throw new Error("No authentication token found");
      }

      // Create credential with either idToken
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Sign-in to Firebase the user with the credential
      const userCredential = await signInWithCredential(auth, googleCredential);
      console.log("Firebase sign in successful:", userCredential.user);
      setIsLoading(false);

      return userCredential;
    } catch (error) {
      console.error("Google sign in error:", error);
      setIsLoading(false);
      throw error;
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setProvider(Provider.google);
      console.log("Google called");
      await onGoogleButtonPress();
    } catch (error) {
      console.error("Sign in failed:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <ThemedButtonIcon
      title="Sign in with Google"
      icon={<Ionicons name="logo-google" size={20} color={iconColor} />}
      variant="secondary"
      size="large"
      onPress={handleGoogleSignIn}
    />
  );
};
