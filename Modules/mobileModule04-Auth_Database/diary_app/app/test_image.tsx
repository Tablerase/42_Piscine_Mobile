import { ThemedText } from "@/components/ThemedText";
import { ImageBackground } from "expo-image";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

const blurhash = "JeJIRvsD~EWVxaba";

export default function App() {
  const handleButtonPress = (buttonName: string) => {
    Alert.alert("Button Pressed", `${buttonName} was pressed!`);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.image}
        source={require("../assets/images/japan_tree_with_greenery.png")}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
      >
        <View style={styles.overlay}>
          <ThemedText style={styles.title}>Welcome to Diary App</ThemedText>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleButtonPress("Test Button 1")}
            >
              <ThemedText style={styles.buttonText}>Test Button 1</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleButtonPress("Test Button 2")}
            >
              <ThemedText style={styles.buttonText}>Test Button 2</ThemedText>
            </TouchableOpacity>
          </View>

          <ThemedText style={styles.description}>
            This is additional content displayed over the background image.
          </ThemedText>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 30,
    textAlign: "center",
  },
  buttonContainer: {
    gap: 15,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});
