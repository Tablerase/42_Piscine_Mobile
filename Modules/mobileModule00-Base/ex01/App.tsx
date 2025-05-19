/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {StrictMode} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

function Main() {
  const [msg, setMsg] = React.useState('Hello There 🖐️ !');
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  /*
   * To keep the template simple and small we're adding padding to prevent view
   * from rendering under the System UI.
   * For bigger apps the reccomendation is to use `react-native-safe-area-context`:
   * https://github.com/AppAndFlow/react-native-safe-area-context
   *
   * You can read more about it here:
   * https://github.com/react-native-community/discussions-and-proposals/discussions/827
   */

  return (
    <View style={styles.sectionContainer}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Text style={styles.sectionTitle}>{msg}</Text>
      <TouchableOpacity
        style={styles.sectionButton}
        onPress={() => {
          setMsg(
            msg === 'Hello There 👋 !'
              ? 'Hello World 🌍 !'
              : 'Hello There 👋 !',
          );
        }}>
        <Text>Click Me</Text>
      </TouchableOpacity>
    </View>
  );
}

function App(): React.JSX.Element {
  return (
    <StrictMode>
      <Main />
    </StrictMode>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    color: 'violet',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionButton: {
    backgroundColor: 'violet',
    padding: 20,
    borderRadius: 25,
  },
});

export default App;
