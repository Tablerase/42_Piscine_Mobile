import {useAppContext} from '@contexts/AppContext';
import {useCitiesList} from '@hooks/useCitiesList';
import {theme} from '@styles/theme';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

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
        {/* TODO: Button to select the city */}
        {cities.map((city, idx) => (
          <Text key={idx}>
            {city.name}, {city.admin1}, {city.country}
          </Text>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
  },
});
