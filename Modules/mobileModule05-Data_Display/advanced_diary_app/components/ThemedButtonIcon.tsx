import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type TouchableOpacityProps,
} from "react-native";

export type ThemedButtonIconProps = TouchableOpacityProps & {
  title: string;
  icon: React.ReactNode;
  lightColor?: string;
  darkColor?: string;
  textLightColor?: string;
  textDarkColor?: string;
  variant?: "primary" | "secondary" | "outline";
  iconPosition?: "left" | "right" | "center"; // Added 'center'
  size?: "small" | "medium" | "large";
};

export function ThemedButtonIcon({
  style,
  title,
  icon,
  lightColor,
  darkColor,
  textLightColor,
  textDarkColor,
  variant = "primary",
  iconPosition = "left", // Default remains "left"
  size = "medium",
  ...otherProps
}: ThemedButtonIconProps) {
  // Determine background color based on variant
  const getBackgroundColor = () => {
    if (variant === "outline") return "background";
    if (variant === "secondary") return "secondary";
    return "tint"; // primary
  };

  // Determine text color based on variant
  const getTextColor = () => {
    if (variant === "outline") return "tint";
    if (variant === "secondary") return "background";
    return "background"; // primary
  };

  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    getBackgroundColor()
  );

  const textColor = useThemeColor(
    { light: textLightColor, dark: textDarkColor },
    getTextColor()
  );

  const borderColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    variant === "secondary" ? "secondary" : "tint"
  );

  const sizeStyles = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  };

  const gapStyles = {
    small: { gap: 6 },
    medium: { gap: 8 },
    large: { gap: 10 },
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        sizeStyles[size],
        { backgroundColor },
        variant === "outline" && {
          borderWidth: 2,
          borderColor,
          backgroundColor: "transparent",
        },
        style,
      ]}
      {...otherProps}
    >
      <View
        style={[
          styles.content,
          gapStyles[size],
          iconPosition === "right" && styles.contentReverse,
        ]}
      >
        {icon}
        {iconPosition !== "center" && ( // Conditionally render Text
          <Text style={[styles.text, { color: textColor }]}>{title}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  medium: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  large: {
    paddingHorizontal: 28,
    paddingVertical: 16,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  contentReverse: {
    flexDirection: "row-reverse",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});
