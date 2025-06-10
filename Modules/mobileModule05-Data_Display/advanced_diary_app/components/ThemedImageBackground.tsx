import { ImageBackground, ImageSource } from "expo-image";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

type ThemedImageBackgroundProps = {
  children: React.ReactNode;
  style?: ViewProps["style"];
  source: ImageSource | string | number | null;
  placeholder?: string | string[] | null | undefined;
  contentFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  transition?: number | null | undefined;
  blurRadius?: number | null | undefined;
};

export function ThemedImageBackground({
  children,
  style,
  source,
  placeholder,
  contentFit = "cover",
  transition = 1000,
  blurRadius = 5,
}: ThemedImageBackgroundProps) {
  return (
    <ImageBackground
      style={[styles.image, style]}
      source={source}
      placeholder={placeholder}
      contentFit={contentFit}
      transition={transition}
      blurRadius={blurRadius ?? undefined}
    >
      <View style={styles.overlay}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    zIndex: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)", // Default overlay, can be customized if needed
  },
  image: {
    flex: 1,
    zIndex: 0,
    width: "100%",
  },
});
