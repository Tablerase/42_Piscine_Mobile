import {useAppContext} from '@contexts/AppContext';
import {GeocodingLocation, useCitiesList} from '@hooks/useCitiesList';
import {theme} from '@styles/theme';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const CityButton = (city: GeocodingLocation) => {
  const handlePress = () => {
    console.log('test');
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.cityButton}>
      <Text style={styles.cityButtonText}>
        {city.name}, {city.admin1}, {city.country}
      </Text>
    </TouchableOpacity>
  );
};

export const SearchList = () => {
  const {cityField, setCitySearchStatus, setLocation} = useAppContext();
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
        {cities.map(cityIdx => (
          <CityButton {...cityIdx} />
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
    backgroundColor: theme.colors.primary + 'AA',
    padding: 10,
    borderRadius: 10,
  },
  cityButtonText: {
    color: 'white',
    fontWeight: '700',
  },
});
