import {WeatherData} from '@hooks/useWeatherData';
import {theme} from '@styles/theme';
import {getWeatherDescription} from '@utils/weatherDescription';
import {StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

const WeatherItem = (weatherData: {
  weather_code?: number;
  temperature?: number;
  temperature_unit?: string;
  wind_speed?: number;
  wind_speed_unit?: string;
}) => {
  return (
    <View style={styles.weatherItemRow}>
      <Text style={styles.forecastItem}>
        {String(getWeatherDescription(weatherData.weather_code, true))}
      </Text>
      <Text style={styles.forecastItem}>
        {weatherData.temperature ?? '--'}
        {weatherData.temperature_unit ?? ''}
      </Text>
      <Text style={styles.forecastItem}>
        {weatherData.wind_speed ?? '--'}
        {weatherData.wind_speed_unit ?? ''}
      </Text>
    </View>
  );
};

export const TodayForecast = (weather: WeatherData) => {
  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {weather.hourly?.time.map((time, index) => (
          <View key={time || index} style={styles.hourlyRow}>
            <Text style={styles.hourlyTime}>{new Date(time).getHours()}h </Text>
            <WeatherItem
              key={time || index}
              weather_code={weather.hourly?.weather_code[index]}
              temperature={weather.hourly?.temperature_2m[index]}
              wind_speed={weather.hourly?.wind_speed_10m[index]}
              temperature_unit={weather.hourly_units?.temperature_2m}
              wind_speed_unit={weather.hourly_units?.wind_speed_10m}
            />
          </View>
        ))}
      </ScrollView>
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
    flexDirection: 'column',
  },
  forecastHeader: {
    flex: 2,
    padding: 5,
    width: '100%',
    justifyContent: 'center',
  },
  forecastBody: {
    flex: 13,
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
