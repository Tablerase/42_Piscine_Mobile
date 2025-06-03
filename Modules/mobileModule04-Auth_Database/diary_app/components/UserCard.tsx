import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthProvider } from "@/utils/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

export const UserCard = () => {
  const { logout, user, isLoggedIn } = useAuthProvider();
  const iconColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");

  return (
    <>
      <View style={styles.profileBigContainer}>
        <ThemedView style={styles.profileContainer}>
          {user?.photoURL && (
            <Image
              source={{ uri: user.photoURL }}
              style={[styles.profileImage, { borderColor: tintColor }]}
            />
          )}
          {user?.displayName && (
            <ThemedText
              type="defaultSemiBold"
              style={{
                fontSize: 30,
                flex: 1,
                textAlign: "center",
                paddingHorizontal: 10,
                minWidth: 150,
              }}
              numberOfLines={2}
              ellipsizeMode="tail"
              adjustsFontSizeToFit
              minimumFontScale={0.6}
            >
              {user.displayName}
            </ThemedText>
          )}
          <Ionicons
            onPress={logout}
            name="log-out"
            size={35}
            style={{ padding: 10 }}
            color={tintColor}
          />
        </ThemedView>
        <LinearGradient
          colors={["rgba(255,255,255,0.8)", "rgba(255,255,255,0.1)"]}
          style={styles.gradient}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  profileBigContainer: {},
  profileContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    overflow: "hidden",
  },
  profileImage: {
    minWidth: 100,
    height: 100,
    borderRadius: 50,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    transform: [
      {
        translateY: 24.0,
      },
    ],
    height: "20%",
  },
});
