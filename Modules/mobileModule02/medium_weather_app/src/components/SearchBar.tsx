import {useAppContext} from '@contexts/AppContext';
/**
 * Geolocation Lib info: https://github.com/michalchudziak/react-native-geolocation
 */
import Geolocation from '@react-native-community/geolocation';
import {theme} from '@styles/theme';
import {useEffect} from 'react';
import {
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SearchField = () => {
  const {cityField, setCityField, setCitySearchStatus} = useAppContext();

  const setSearchText = (city: string) => {
    setCityField(city);
    setCitySearchStatus(true);
  };

  return (
    <>
      <View style={styles.searchField}>
        <Icon name="map-search" size={20} />
        <TextInput
          placeholder="Search location..."
          value={cityField}
          onChangeText={setSearchText}
          style={styles.textInput}
        />
      </View>
    </>
  );
};

const GeolocationButton = () => {
  const {setLocation, setLocationPerm, setCityField, setCitySearchStatus} =
    useAppContext();

  useEffect(() => {
    handlePress();
  }, []);

  const handlePress = () => {
    setCitySearchStatus(false);
    setCityField('');
    Geolocation.getCurrentPosition(
      pos => {
        setLocation(pos);
        setLocationPerm(true);
        console.log(pos);
      },
      error => {
        console.log(error);
        if (error.PERMISSION_DENIED) {
          setLocationPerm(false);
        }
      },
    );
  };

  return (
    <>
      <TouchableOpacity onPress={handlePress} style={styles.locationField}>
        <Icon name="navigation-variant" size={20} />
      </TouchableOpacity>
    </>
  );
};

export const SearchBar = () => {
  return (
    <>
      <StatusBar backgroundColor={theme.colors.primary} />
      <View style={styles.container}>
        <SearchField />
        <View style={styles.separator} />
        <GeolocationButton />
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
