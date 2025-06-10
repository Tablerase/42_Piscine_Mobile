import { useThemeColor } from "@/hooks/useThemeColor";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from "react-native";

export type ThemedButtonProps = TouchableOpacityProps & {
  title: string;
  lightColor?: string;
  darkColor?: string;
  textLightColor?: string;
  textDarkColor?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
};

export function ThemedButton({
  style,
  title,
  lightColor,
  darkColor,
  textLightColor,
  textDarkColor,
  variant = "primary",
  size = "medium",
  ...otherProps
}: ThemedButtonProps) {
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
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
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
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});
