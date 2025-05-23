import {Page, useAppContext} from '@contexts/AppContext';
import {useWeatherData} from '@hooks/useWeatherData';
import {theme} from '@styles/theme';
import {ActivityIndicator, Linking, StyleSheet, Text, View} from 'react-native';
import {CurrentForecast} from './CurrentForecast';
import {TodayForecast} from './TodayForecast';
import {WeeklyForecast} from './WeeklyForecast';

const WeatherInfo = () => {
  const {location, page} = useAppContext();
  const {loading, error, data} = useWeatherData(location, page);
  const weather = data;
  let content;

  let place;
  if (
    !location.name &&
    location.coords?.longitude &&
    location.coords?.latitude
  ) {
    place = [
      String(location.coords?.latitude ?? 'Unknown'),
      String(location.coords?.longitude ?? 'Unknown'),
    ];
  } else {
    place = [
      String(location.name || 'Unknown'),
      String(location.region || 'Unknown'),
      String(location.country || 'Unknown'),
    ];
  }

  if (loading) {
    content = (
      <>
        <View style={styles.forecast}>
          <ActivityIndicator size={'large'} color={theme.colors.primary} />
        </View>
      </>
    );
  } else if (error) {
    content = <Text style={styles.noPermissionText}>{error}</Text>;
  } else if (weather) {
    if (page === Page.Currently) {
      content = (
        <>
          <CurrentForecast {...weather} />
        </>
      );
    } else if (page === Page.Today) {
      // console.log(weather);
      content = <TodayForecast {...weather} />;
    } else if (page === Page.Weekly) {
      // console.log(weather);
      content = <WeeklyForecast {...weather} />;
    } else {
      // console.log('Unknow weather error');
      content = <Text>Unknown weather error</Text>;
    }
  }

  let header;
  const colors = [
    theme.colors.ternary + 'aa',
    theme.colors.primary + 'aa',
    theme.colors.primary + 'aa',
  ];
  const placeSize = place.join('').length;
  const placeTextSize = (size: number) => {
    if (size <= 20) {
      return 26;
    } else if (size <= 30) {
      return 25;
    } else if (size <= 50) {
      return 20;
    } else {
      return 16;
    }
  };

  header = (
    <View style={styles.forecastHeaderObj}>
      {place.map((placeObj, idx) => (
        <Text
          key={idx}
          style={[
            styles.forecastHeaderText,
            {backgroundColor: colors[idx % colors.length]},
            {fontSize: placeTextSize(placeSize)},
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
    flex: 2,
    padding: 5,
    marginTop: 5,
    width: '100%',
    justifyContent: 'center',
  },
  forecastBody: {
    flex: 17,
    width: '100%',
  },
  forecastHeaderObj: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 5,
  },
  forecastHeaderText: {
    flexShrink: 1,
    textShadowColor: 'grey',
    textShadowOffset: {width: 4, height: 4},
    borderRadius: theme.borderRadius.medium,
    fontSize: theme.fontSizes.xlarge,
    textAlign: 'center',
    padding: 5,
    marginHorizontal: 2,
  },
  forecastText: {
    fontSize: theme.fontSizes.xlarge,
    fontWeight: 'bold',
  },
  forecastItem: {
    fontSize: theme.fontSizes.large,
    borderRadius: theme.borderRadius.medium,
    padding: 4,
    margin: 2,
    backgroundColor: 'lavender',
  },
  weatherItemRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 4,
  },
  hourlyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  hourlyTime: {
    width: 35,
    padding: 5,
  },
  dailyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 4,
  },
  dailyTime: {
    minWidth: 80,
    padding: 5,
  },
  flexShrink: {
    flexShrink: 1,
  },
  scrollContainer: {
    paddingBottom: 16,
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
