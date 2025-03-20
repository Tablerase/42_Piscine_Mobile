import { StatusBar } from "expo-status-bar";
import { StrictMode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function App() {
  return (
    <StrictMode>
      <Main />
    </StrictMode>
  );
}

function Main() {
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#6200ee",
          marginBottom: 20,
        }}
      >
        Hello There 🖐️
      </Text>
      <TouchableOpacity
        onPress={() => {
          console.log("Button Pressed");
        }}
        style={{
          backgroundColor: "#6200ee",
          padding: 10,
          borderRadius: 5,
        }}
      >
        <Text style={{ color: "#fff" }}>Press Me</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
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
});
