import {Page, useAppContext} from '@contexts/AppContext';
import {useWeatherData} from '@hooks/useWeatherData';
import {theme} from '@styles/theme';
import {useEffect, useState} from 'react';
import {ActivityIndicator, Linking, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

const weatherCodeDescriptions: {[key: number]: string} = {
  0: 'Clear sky ☀️',
  1: 'Mainly clear 🌤️',
  2: 'Partly cloudy ⛅',
  3: 'Overcast ☁️',
  45: 'Fog 🌫️',
  48: 'Depositing rime fog 🌫️❄️',
  51: 'Light drizzle 🌦️',
  53: 'Moderate drizzle 🌦️',
  55: 'Dense drizzle 🌧️',
  56: 'Light freezing drizzle 🌧️❄️',
  57: 'Dense freezing drizzle 🌧️❄️',
  61: 'Slight rain 🌦️',
  63: 'Moderate rain 🌧️',
  65: 'Heavy rain 🌧️💧',
  66: 'Light freezing rain 🌧️❄️',
  67: 'Heavy freezing rain 🌧️❄️',
  71: 'Slight snow fall 🌨️',
  73: 'Moderate snow fall 🌨️',
  75: 'Heavy snow fall ❄️',
  77: 'Snow grains 🌨️',
  80: 'Slight rain showers 🌦️',
  81: 'Moderate rain showers 🌧️',
  82: 'Violent rain showers ⛈️',
  85: 'Slight snow showers 🌨️',
  86: 'Heavy snow showers ❄️',
  95: 'Thunderstorm ⛈️',
  96: 'Thunderstorm with slight hail ⛈️🌨️',
  99: 'Thunderstorm with heavy hail ⛈️❄️',
};

function getWeatherDescription(code?: number): string {
  if (code === undefined) {
    return 'Unknow weather';
  }
  return weatherCodeDescriptions[code] || 'Unknown weather';
}

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
        {getWeatherDescription(weatherData.weather_code)}
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

const WeatherInfo = () => {
  const {location, page} = useAppContext();
  const {loading, error, data} = useWeatherData(location, page);
  const weather = data;
  let content;

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
          <WeatherItem
            weather_code={weather.current?.weather_code}
            temperature={weather.current?.temperature_2m}
            temperature_unit={weather.current_units?.temperature_2m}
            wind_speed={weather.current?.wind_speed_10m}
            wind_speed_unit={weather.current_units?.wind_speed_10m}
          />
        </>
      );
    } else if (page === Page.Today) {
      console.log(weather);
      content = (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {weather.hourly?.time.map((time, index) => (
            <View key={time || index} style={styles.hourlyRow}>
              <Text style={styles.hourlyTime}>
                {new Date(time).getHours()}h{' '}
              </Text>
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
      );
    } else if (page === Page.Weekly) {
      console.log(weather);
      content = (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {weather.daily?.time.map((time, index) => (
            <View key={time || index} style={styles.dailyRow}>
              <Text style={styles.dailyTime}>{time}</Text>
              <Text style={[styles.forecastItem, styles.flexShrink]}>
                {getWeatherDescription(weather.daily?.weather_code[index])}
              </Text>
              <Text style={[styles.forecastItem, styles.flexShrink]}>
                {weather.daily?.temperature_2m_min[index]}/
                {weather.daily?.temperature_2m_max[index]}{' '}
                {weather.daily_units?.temperature_2m_max}
              </Text>
            </View>
          ))}
        </ScrollView>
      );
    } else {
      console.log('Unknow weather error');
      content = <Text>Unknown weather error</Text>;
    }
  }

  let header;
  const [place, setPlace] = useState<string[]>([]);

  useEffect(() => {
    let newPlace;
    if (
      !location.name &&
      location.coords?.longitude &&
      location.coords?.latitude
    ) {
      newPlace = [
        String(location.coords?.latitude ?? 'Unknown'),
        String(location.coords?.longitude ?? 'Unknown'),
      ];
    } else {
      newPlace = [
        String(location.name || 'Unknown'),
        String(location.region || 'Unknown'),
        String(location.country || 'Unknown'),
      ];
    }
    setPlace(newPlace);
  }, [location]);

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
  const [showTimeoutError, setShowTimeoutError] = useState(false);

  useEffect(() => {
    // Set a timeout to show connection error if location is not loaded
    const timer = setTimeout(() => {
      if (!location.coords && !location.name) {
        setShowTimeoutError(true);
      }
    }, 5000);

    // Clear timeout if location is loaded
    if (location.coords || location.name) {
      setShowTimeoutError(false);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [location.coords, location.name]);

  if (locationPerm === false && !location.name) {
    return <GeolocationErrorItem />;
  }

  if (showTimeoutError) {
    return (
      <View style={styles.forecast}>
        <Text style={styles.noPermissionText}>
          Service connection lost, please check your internet connection
        </Text>
      </View>
    );
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
