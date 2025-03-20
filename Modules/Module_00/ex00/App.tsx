import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import { StrictMode } from "react";

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
          fontSize: 30,
          fontWeight: "bold",
          color: "orange",
          marginBottom: 20,
        }}
      >
        Hello There 🖐️
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: "orange",
          padding: 10,
          borderRadius: 5,
        }}
        onPress={() => console.log("Button is pressed !")}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Press me</Text>
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
