import {Page, useAppContext} from '@contexts/AppContext';
import {WeatherData} from '@hooks/useWeatherData';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  getWeatherDescription,
  weatherCodeItem,
} from '@utils/weatherDescription';
import {StyleSheet, Text, View} from 'react-native';
import {getTemperatureColor} from '@utils/temperatureColor';

export const CurrentForecast = (weather: WeatherData) => {
  const {page, direction} = useAppContext();

  if (page !== Page.Currently) {
    throw new Error(
      'Current Forecast should be use only within currently page',
    );
  }

  const weatherDescriptions = getWeatherDescription(
    weather.current?.weather_code,
    false,
  ) as weatherCodeItem;

  const temperatureColor = getTemperatureColor(weather.current?.temperature_2m);

  return (
    <>
      <View
        style={[
          styles.currentContainer,
          direction === 'row'
            ? {flexDirection: direction, alignItems: 'center'}
            : {},
        ]}>
        <Text style={styles.forecastDescriptionText}>
          {weatherDescriptions.desc}
        </Text>
        <Text style={styles.forecastDescriptionEmojis}>
          {weatherDescriptions.emojis}
        </Text>
        <Text
          style={[styles.forecastTemperatureText, {color: temperatureColor}]}>
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
    justifyContent: 'center',
    gap: 20,
    height: '100%',
  },
  forecastTemperatureText: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
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
