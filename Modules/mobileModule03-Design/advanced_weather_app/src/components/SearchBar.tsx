import {useAppContext} from '@contexts/AppContext';
/**
 * Geolocation Lib info: https://github.com/michalchudziak/react-native-geolocation
 */
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import {theme} from '@styles/theme';
import {useEffect} from 'react';
import {
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Config from 'react-native-config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SearchField = () => {
  const {cityField, setCityField, setCitySearchStatus} = useAppContext();

  const setSearchText = (city: string) => {
    setCityField(city);
    if (city.length > 0) {
      setCitySearchStatus(true);
    } else {
      setCitySearchStatus(false);
    }
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

// Add interface for better type safety
interface LocationInfo {
  city: string | null;
  region: string | null;
  country: string | null;
}

const fetchReverseGeocode = async (
  location: GeolocationResponse,
): Promise<LocationInfo | null> => {
  /**
   * Doc: https://developers.google.com/maps/documentation/geocoding/requests-reverse-geocoding
   */
  try {
    // Check if API key exists
    // ! API is store in env for educationnal purpose here (it's impossible to prevent reverse engineering
    // ! of in app secret that's why other methods to stores/recover secrets should be used)
    if (!Config.GOOGLE_GEOCODING_API) {
      console.error('Google Geocoding API key is not configured');
      return null;
    }

    const latlng =
      location.coords.latitude.toString() +
      ',' +
      location.coords.longitude.toString();
    const params = new URLSearchParams({
      latlng: latlng,
      key: Config.GOOGLE_GEOCODING_API,
      result_type: [
        'country',
        'administrative_area_level_1',
        'administrative_area_level_2',
      ].join('|'),
    });
    const url = `https://maps.googleapis.com/maps/api/geocode/json?${params}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error('HTTP error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      let city = null;
      let region = null;
      let country = null;

      data.results.forEach((result: any) => {
        if (result.types.includes('administrative_area_level_2')) {
          city =
            result.address_components[0]?.long_name ||
            result.formatted_address.split(',')[0];
        } else if (result.types.includes('administrative_area_level_1')) {
          region =
            result.address_components[0]?.long_name ||
            result.formatted_address.split(',')[0];
        } else if (result.types.includes('country')) {
          country =
            result.address_components[0]?.long_name ||
            result.formatted_address.split(',')[0];
        }
      });

      return {city, region, country};
    } else {
      console.error('Geocoding failed:', data.status, data.error_message);
      return null;
    }
  } catch (error) {
    console.error('Error fetching reverse geocode:', error);
    return null;
  }
};

const GeolocationButton = () => {
  const {setLocation, setLocationPerm, setCityField, setCitySearchStatus} =
    useAppContext();

  useEffect(() => {
    handlePress();
  }, []);

  const handlePress = () => {
    setCitySearchStatus(false);
    setLocation({});
    setCityField('');

    Geolocation.getCurrentPosition(
      async pos => {
        try {
          const address = await fetchReverseGeocode(pos);
          if (address) {
            setLocation({
              ...pos,
              name: address.city ?? '',
              region: address.region ?? '',
              country: address.country ?? '',
            });
          } else {
            setLocation(pos);
          }
          setLocationPerm(true);
        } catch (error) {
          console.log('Error getting address:', error);
          throw new Error('Error with google API');
        }
      },
      error => {
        console.log(error);
        if (error.PERMISSION_DENIED) {
          setLocationPerm(false);
        }
        setLocation({});
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
    backgroundColor: theme.colors.primary,
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
