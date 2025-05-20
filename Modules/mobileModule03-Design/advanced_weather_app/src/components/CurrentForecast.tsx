import {Page, useAppContext} from '@contexts/AppContext';
import {WeatherData} from '@hooks/useWeatherData';
import {theme} from '@styles/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  getWeatherDescription,
  weatherCodeItem,
} from '@utils/weatherDescription';
import {StyleSheet, Text, View} from 'react-native';

export const CurrentForecast = (weather: WeatherData) => {
  const {page} = useAppContext();

  if (page !== Page.Currently) {
    throw new Error(
      'Current Forecast should be use only within currently page',
    );
  }

  const weatherDescriptions = getWeatherDescription(
    weather.current?.weather_code,
    false,
  ) as weatherCodeItem;

  return (
    <>
      <View style={styles.currentContainer}>
        <Text style={styles.forecastDescriptionText}>
          {weatherDescriptions.desc}
        </Text>
        <Text style={styles.forecastDescriptionEmojis}>
          {weatherDescriptions.emojis}
        </Text>
        <Text style={[styles.forecastTemperatureText, {color: 'red'}]}>
          {weather.current?.temperature_2m ?? '--'}
          {weather.current_units?.temperature_2m ?? ''}
        </Text>
        <View style={styles.forecastWindContainer}>
          <Icon
            name="weather-windy"
            size={styles.forecastWindText.fontSize}
            color={styles.forecastWindIcon.color}
          />
          <Text style={styles.forecastWindText}>
            {weather.current?.wind_speed_10m ?? '--'}
            {weather.current_units?.wind_speed_10m ?? ''}
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  currentContainer: {
    flex: 1,
    // justifyContent: 'center',
    gap: 20,
    height: '100%',
  },
  forecastTemperatureText: {
    fontSize: 30,
    textAlign: 'center',
  },
  forecastWindText: {
    fontSize: 30,
    textAlign: 'center',
  },
  forecastWindIcon: {
    color: '#87CEEB',
  },
  forecastDescriptionText: {
    fontSize: 30,
    textAlign: 'center',
  },
  forecastDescriptionEmojis: {
    fontSize: 90,
    textAlign: 'center',
  },
  forecastWindContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
