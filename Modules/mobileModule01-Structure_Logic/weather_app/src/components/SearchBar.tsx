import {theme} from '@styles/theme';
import {
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface searchBarProps {
  searchText: string;
  setSearchText: (location: string) => void;
}

const SearchField = ({searchText, setSearchText}: searchBarProps) => {
  return (
    <>
      <View style={styles.searchField}>
        <Icon name="map-search" size={20} />
        <TextInput
          placeholder="Search location..."
          value={searchText}
          onChangeText={setSearchText}
          style={styles.textInput}
        />
      </View>
    </>
  );
};

const GeolocationButton = ({searchText, setSearchText}: searchBarProps) => {
  const handlePress = () => {
    setSearchText('Geolocation');
    console.log('Location: ', searchText);
  };

  return (
    <>
      <TouchableOpacity onPress={handlePress} style={styles.locationField}>
        <Icon name="navigation-variant" size={20} />
      </TouchableOpacity>
    </>
  );
};

export const SearchBar = ({searchText, setSearchText}: searchBarProps) => {
  return (
    <>
      <StatusBar backgroundColor={theme.colors.primary} />
      <View style={styles.container}>
        <SearchField searchText={searchText} setSearchText={setSearchText} />
        <View style={styles.separator} />
        <GeolocationButton
          searchText={searchText}
          setSearchText={setSearchText}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary + 'AA',
    height: 50,
    flexDirection: 'row',
  },
  searchField: {
    flex: 3,
    padding: 5,
    gap: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    width: '100%',
  },
  locationField: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    width: 1,
    margin: 5,
    backgroundColor: 'aliceblue',
  },
});
