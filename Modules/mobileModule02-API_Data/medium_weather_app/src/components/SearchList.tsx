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
      <Text
        style={[
          styles.cityButtonText,
          isPressed && styles.cityButtonTextActive,
        ]}>
        {city.name}, {city.admin1}, {city.country}
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
    return <Text>Error: {error}</Text>;
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
  cityButton: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 10,
  },
  CityButtonPressed: {
    backgroundColor: theme.colors.secondary,
    padding: 14,
  },
  cityButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  cityButtonTextActive: {
    color: 'black',
    fontWeight: '800',
  },
});
