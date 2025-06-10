import { ThemedButtonIcon } from "@/components/ThemedButtonIcon";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { Provider, useAuthProvider } from "./AuthProvider";

// ! Here handling on client because of project limitations (no backend - only firebase)
// Github scopes: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps
// Github oauth api: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps

const githubClientId = process.env.EXPO_PUBLIC_GITHUB_CLIENT_FIREBASE_ID;

// Endpoint
const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint: `https://github.com/settings/connections/applications/${githubClientId}`,
};

export const GithubAuth = () => {
  const { setProvider } = useAuthProvider();
  const iconColor = useThemeColor({}, "background");

  WebBrowser.maybeCompleteAuthSession();
  const redirectUri = makeRedirectUri({
    scheme: "diaryapp",
    path: "oauth",
  });
  // console.log("Redirect URI", redirectUri);
  // console.log(githubClientId);
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: githubClientId!,
      scopes: ["identity", "user"],
      redirectUri: redirectUri,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      // const { code } = response.params;
      // console.log(response, code);
    }
  }, [response]);

  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  return (
    <ThemedButtonIcon
      disabled={!request}
      title="Sign in with GitHub"
      icon={<Ionicons name="logo-github" size={20} color={iconColor} />}
      variant="primary"
      size="large"
      onPress={() => {
        setProvider(Provider.github);
        console.log("Gihtub promptAsync called");
        promptAsync({
          showTitle: true,
          toolbarColor: "#6200EE",
          browserPackage: "com.android.chrome", // Force Chrome (this works!)
        });
      }}
    />
  );
};
