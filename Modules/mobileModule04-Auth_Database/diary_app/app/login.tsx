import { ThemedLoader } from "@/components/ThemedLoader";
import { ThemedText } from "@/components/ThemedText";
import { useAuthProvider } from "@/utils/AuthProvider";
import { GithubAuth } from "@/utils/GithubAuth";
import { GoogleAuth } from "@/utils/GoogleAuth";
import { ImageBackground } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function Login() {
  const { isLoggedIn, isLoading } = useAuthProvider();
  const router = useRouter();

  // useEffect(() => {
  //   if (isLoggedIn) {
  //     console.log("Login: User already logged");
  //     router.replace("/profile");
  //   }
  // }, [isLoggedIn, router]);

  return (
    <ImageBackground
      style={styles.image}
      source={require("../assets/images/japan_tree_with_greenery.png")}
      placeholder={"JeJIRvsD~EWVxaba"}
      contentFit="cover"
      transition={1000}
      blurRadius={5}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {isLoading ? (
            <ThemedLoader />
          ) : (
            <>
              <ThemedText type="title" style={styles.title}>
                Login page
              </ThemedText>
              <GithubAuth />
              <GoogleAuth />
            </>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 25,
    padding: 20,
  },
  image: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  title: {
    marginBottom: 30,
    textAlign: "center",
    color: "white",
  },
});
