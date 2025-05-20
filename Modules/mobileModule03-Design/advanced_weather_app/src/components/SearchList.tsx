import {Position, useAppContext} from '@contexts/AppContext';
import {GeocodingLocation, useCitiesList} from '@hooks/useCitiesList';
import {theme} from '@styles/theme';
import {useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CityButton = (city: GeocodingLocation) => {
  const {setCitySearchStatus, setLocation} = useAppContext();
  const [isPressed, setIsPressed] = useState(false);
  const handlePress = () => {
    setLocation({
      name: city.name,
      region: city.admin1,
      country: city.country,
      coords: {
        latitude: city.latitude,
        longitude: city.longitude,
      },
    } as Position);
    setCitySearchStatus(false);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={() => {
        setIsPressed(true);
      }}
      onPressOut={() => {
        setIsPressed(false);
      }}
      style={[styles.cityButton, isPressed && styles.CityButtonPressed]}>
      <Icon
        size={20}
        name="city"
        color={styles.cityButtonText.color}
        style={styles.CityButtonIcon}
      />
      <Text
        style={[
          styles.cityButtonTextName,
          isPressed && styles.cityButtonTextActive,
        ]}>
        {city.name}
      </Text>
      <Text
        style={[
          styles.cityButtonText,
          isPressed && styles.cityButtonTextActive,
        ]}>
        , {city.admin1}, {city.country}
      </Text>
    </TouchableOpacity>
  );
};

export const SearchList = () => {
  const {cityField} = useAppContext();
  const {cities, loading, error} = useCitiesList(cityField);

  if (loading) {
    return <ActivityIndicator color={theme.colors.primary} />;
  }
  if (error) {
    return (
      <View style={styles.containerError}>
        <Text style={styles.textError}>Error: {error}</Text>
      </View>
    );
  }

  if (cities.length === 0) {
    return (
      <View style={styles.containerError}>
        <Text style={styles.textError}>
          Could not find any result for the supplied address or coordinates.
        </Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        {cities.map((city: GeocodingLocation, index: number) => (
          <CityButton
            key={`${
              city.id ??
              `${city.name.replace(/[^a-z0-9]/gi, '')}-${city.admin1?.replace(
                /[^a-z0-9]/gi,
                '',
              )}-${city.country.replace(/[^a-z0-9]/gi, '')}-${index}`
            }`}
            {...city}
          />
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    marginTop: 5,
    gap: 5,
  },
  containerError: {
    justifyContent: 'center',
    height: '85%',
  },
  textError: {
    textAlign: 'center',
    color: theme.colors.error,
    fontSize: theme.fontSizes.large,
  },
  cityButton: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  CityButtonIcon: {
    padding: 5,
  },
  CityButtonPressed: {
    backgroundColor: theme.colors.secondary,
    padding: 14,
  },
  cityButtonText: {
    color: 'white',
  },
  cityButtonTextName: {
    color: 'white',
    fontWeight: '700',
  },
  cityButtonTextActive: {
    color: 'black',
    fontWeight: '800',
  },
});
