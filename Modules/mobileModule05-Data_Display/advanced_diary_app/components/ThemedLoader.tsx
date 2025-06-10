import { useThemeColor } from "@/hooks/useThemeColor";
import { ActivityIndicator } from "react-native";

export const ThemedLoader = () => {
  const tintColor = useThemeColor({}, "tint");

  return (
    <>
      <ActivityIndicator size={100} color={tintColor} />
    </>
  );
};
