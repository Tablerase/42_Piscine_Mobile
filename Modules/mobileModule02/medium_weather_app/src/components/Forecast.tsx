import {useAppContext} from '@contexts/AppContext';
import {useWeatherData} from '@hooks/useWeatherData';
import {theme} from '@styles/theme';
import {ActivityIndicator, Linking, StyleSheet, Text, View} from 'react-native';

const weatherCodeDescriptions: {[key: number]: string} = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

function getWeatherDescription(code: number): string {
  return weatherCodeDescriptions[code] || 'Unknown weather';
}

const WeatherInfo = () => {
  const {location, page} = useAppContext();
  const {loading, error, data} = useWeatherData(location, page);
  let content;

  if (loading) {
    content = <ActivityIndicator color={theme.colors.primary} />;
  }
  if (error) {
    content = <Text style={styles.noPermissionText}>{error}</Text>;
  }
  if (data) {
    content = <Text>{JSON.stringify(data)}</Text>;
  }

  let header;
  let place;
  if (
    !location.name &&
    location.coords?.longitude &&
    location.coords?.latitude
  ) {
    place = [location.coords?.latitude, location.coords?.longitude];
  } else {
    place = [location.name, location.region, location.country];
  }
  const colors = ['#FFD700', '#87CEEB', '#FF69B4'];
  header = (
    <View style={styles.forecastHeaderObj}>
      {place.map((placeObj, idx) => (
        <Text
          key={idx}
          style={[
            styles.forecastHeaderText,
            {backgroundColor: colors[idx % colors.length]},
          ]}>
          {placeObj}
        </Text>
      ))}
    </View>
  );

  return (
    <>
      <View style={styles.forecast}>
        <View style={styles.forecastHeader}>{header}</View>
        <View style={styles.forecastBody}>{content}</View>
      </View>
    </>
  );
};

const GeolocationErrorItem = () => {
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
};

export const Forecast = () => {
  const {location, locationPerm} = useAppContext();

  // let place: string = location.name ?? '';
  // if (
  //   !location.name &&
  //   location.coords?.longitude &&
  //   location.coords?.latitude
  // ) {
  //   place = location.coords?.latitude + ' ' + location.coords?.longitude;
  // }

  if (locationPerm === false && !location.name) {
    return <GeolocationErrorItem />;
  }

  return location.coords ? (
    <WeatherInfo />
  ) : (
    <ActivityIndicator color={theme.colors.secondary} />
  );
};

const styles = StyleSheet.create({
  forecast: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '95%',
    width: '100%',
    textAlign: 'center',
    flexDirection: 'column',
  },
  forecastHeader: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: 'pink',
    justifyContent: 'center',
  },
  forecastHeaderObj: {
    gap: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  forecastHeaderText: {
    textShadowColor: 'grey',
    textShadowOffset: {width: 4, height: 4},
    borderRadius: theme.borderRadius.medium,
    fontSize: theme.fontSizes.xlarge,
    textAlign: 'center',
    padding: 5,
  },
  forecastBody: {
    flexGrow: 15,
    backgroundColor: 'green',
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
