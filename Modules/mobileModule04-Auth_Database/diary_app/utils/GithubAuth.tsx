import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { Button, View } from "react-native";
import { Provider, useAuthProvider } from "./AuthProvider";

const githubClientId = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID;

// Endpoint
const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint: `https://github.com/settings/connections/applications/${githubClientId}`,
};

export const GithubAuth = () => {
  const { setProvider } = useAuthProvider();

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
      scopes: ["identity"],
      redirectUri: redirectUri,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
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
    <View style={{ gap: 10 }}>
      <Button
        disabled={!request}
        title="Login with GitHub"
        onPress={() => {
          setProvider(Provider.github);
          console.log("promptAsync called");
          promptAsync({
            showTitle: true,
            toolbarColor: "#6200EE",
            browserPackage: "com.android.chrome", // Force Chrome (this works!)
          });
        }}
      />
    </View>
  );
};
