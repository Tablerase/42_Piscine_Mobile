import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { Alert, Button, View } from "react-native";

const githubClientId = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID;

// Endpoint
const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint: `https://github.com/settings/connections/applications/${githubClientId}`,
};

export const GithubAuth = () => {
  WebBrowser.maybeCompleteAuthSession();
  const redirectUri = makeRedirectUri({
    scheme: "diaryapp",
    path: "oauth",
  });
  console.log("Redirect URI", redirectUri);
  console.log(githubClientId);
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: githubClientId!,
      scopes: ["identity"],
      redirectUri: redirectUri,
    },
    discovery
  );

  // Test function to open a simple URL
  const testBrowser = async () => {
    try {
      console.log("Testing browser...");
      const result = await WebBrowser.openBrowserAsync("https://google.com");
      console.log("Browser result:", result);
      Alert.alert("Browser Test", `Result: ${result.type}`);
    } catch (error) {
      console.error("Browser error:", error);
      Alert.alert("Browser Error", `Error: ${error}`);
    }
  };

  // Test GitHub directly with specific browser
  const testGitHubDirect = async () => {
    try {
      console.log("Testing direct GitHub access...");
      const result = await WebBrowser.openBrowserAsync("https://github.com", {
        showTitle: true,
        toolbarColor: "#6200EE",
        secondaryToolbarColor: "black",
        enableBarCollapsing: false,
        showInRecents: true,
        browserPackage: "com.android.chrome", // Force Chrome
      });
      console.log("Direct GitHub result:", result);
      Alert.alert("Direct GitHub Test", `Result: ${result.type}`);
    } catch (error) {
      console.error("Direct GitHub error:", error);
      Alert.alert("Direct GitHub Error", `Error: ${error}`);
    }
  };

  // Enhanced test for GitHub OAuth URL with specific browser
  const testGitHubAuth = async () => {
    console.log("testGitHubAuth called");
    if (request?.url) {
      console.log("OAuth URL:", request.url);
      try {
        console.log("About to call WebBrowser.openBrowserAsync...");
        const result = await WebBrowser.openBrowserAsync(request.url, {
          showTitle: true,
          toolbarColor: "#6200EE",
          secondaryToolbarColor: "black",
          enableBarCollapsing: false,
          showInRecents: true,
          browserPackage: "com.android.chrome", // Force Chrome
        });
        console.log("GitHub OAuth result:", result);
        Alert.alert("GitHub Test", `Result: ${result.type}`);
      } catch (error) {
        console.error("GitHub OAuth error:", error);
        Alert.alert("GitHub Error", `Error: ${JSON.stringify(error)}`);
      }
    } else {
      console.log("No request URL available");
      Alert.alert("No URL", "Request URL is not available");
    }
  };

  // Test GitHub auth with different browsers
  const testDifferentBrowsers = async () => {
    const browsers = [
      { name: "Chrome", package: "com.android.chrome" },
      { name: "Firefox", package: "org.mozilla.firefox" },
      { name: "Samsung Internet", package: "com.sec.android.app.sbrowser" },
    ];

    for (const { name, package: browserPackage } of browsers) {
      try {
        console.log(`Testing GitHub auth with ${name}...`);
        if (request?.url) {
          const result = await WebBrowser.openBrowserAsync(request.url, {
            showTitle: true,
            toolbarColor: "#6200EE",
            secondaryToolbarColor: "black",
            enableBarCollapsing: false,
            showInRecents: true,
            browserPackage,
          });
          console.log(`${name} GitHub OAuth result:`, result);
          Alert.alert(`${name} GitHub Test`, `Result: ${result.type}`);
        } else {
          console.log("No request URL available");
          Alert.alert("No URL", "Request URL is not available");
        }
      } catch (error) {
        console.error(`${name} GitHub OAuth error:`, error);
        Alert.alert(`${name} GitHub Error`, `Error: ${JSON.stringify(error)}`);
      }
    }
  };

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      console.log(response, code);
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
      {/* <Button title="Test Browser" onPress={testBrowser} /> */}
      {/* <Button title="Test Different Browsers" onPress={testDifferentBrowsers} /> */}
      {/* <Button title="Test Github direct" onPress={testGitHubDirect} /> */}
      {/* <Button title="Test Github auth" onPress={testGitHubAuth} /> */}
      <Button
        disabled={!request}
        title="Login with GitHub"
        onPress={() => {
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
