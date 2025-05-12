import {useAppContext} from '@contexts/AppContext';
import {theme} from '@styles/theme';
import {Linking, StyleSheet, Text, View} from 'react-native';

export const Forecast = () => {
  const {location, page, locationPerm} = useAppContext();
  const period = page;
  let place: string = location.name ?? '';

  if (
    !location.name &&
    location.coords?.longitude &&
    location.coords?.latitude
  ) {
    place = location.coords?.latitude + ' ' + location.coords?.longitude;
  }

  if (locationPerm === false) {
    return (
      <>
        <View style={styles.forecast}>
          <Text style={styles.noPermissionText}>
            Geolocation is not available, please enable it in your App settings
          </Text>
          <Text
            style={styles.linkToSettings}
            onPress={() => {
              Linking.openSettings();
            }}>
            Open App Settings
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <View style={styles.forecast}>
        <Text style={styles.forecastText}>{period}</Text>
        <Text style={styles.forecastText}>{place}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  forecast: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '95%',
    width: '100%',
    textAlign: 'center',
  },
  forecastText: {
    fontSize: theme.fontSizes.xlarge,
    fontWeight: 'bold',
  },
  noPermissionText: {
    fontSize: theme.fontSizes.xlarge,
    textAlign: 'center',
    color: theme.colors.error,
  },
  linkToSettings: {
    color: theme.colors.primary,
    marginTop: 16,
    textDecorationLine: 'underline',
    fontSize: theme.fontSizes.large,
  },
});
