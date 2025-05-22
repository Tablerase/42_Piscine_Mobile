import {useAppContext} from '@contexts/AppContext';
import {WeatherData} from '@hooks/useWeatherData';
import {theme} from '@styles/theme';
import {getTemperatureColor} from '@utils/temperatureColor';
import {
  getWeatherDescription,
  weatherCodeItem,
} from '@utils/weatherDescription';
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {LineChart} from 'react-native-gifted-charts';
import {Stop, LinearGradient} from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface HourlyCardProps {
  time: string;
  temperature: number;
  weatherCode: number;
  temperatureUnit?: string;
  wind: number;
  windUnit?: string;
}

const HourlyWeatherCard = ({
  time,
  temperature,
  weatherCode,
  temperatureUnit,
  wind,
  windUnit,
}: HourlyCardProps) => {
  const displayTime = new Date(time).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  });

  // Example: const { iconName, description } = getWeatherInfo(weatherCode);
  // For now, using placeholders.
  const weatherDescription: weatherCodeItem = getWeatherDescription(
    weatherCode,
    false,
  ) as weatherCodeItem;
  const iconPlaceholder = weatherDescription.emojis;
  // const descriptionPlaceholder = weatherDescription.desc;
  const temperatureColor = getTemperatureColor(temperature);

  return (
    <View style={[styles.weatherCard, {borderColor: temperatureColor}]}>
      <Text style={styles.forecastDescriptionText}>{displayTime}</Text>
      <Text style={styles.forecastDescriptionEmojis}>{iconPlaceholder}</Text>
      <Text style={[styles.forecastTemperatureText, {color: temperatureColor}]}>
        {temperature.toFixed(0)}
        {temperatureUnit}
      </Text>
      {/* <Text style={styles.forecastDescriptionText}>{descriptionPlaceholder}</Text> */}
      <View style={styles.forecastWindContainer}>
        <Icon
          name="weather-windy"
          size={styles.forecastWindText.fontSize}
          color={styles.forecastWindIcon.color}
        />
        <Text style={styles.forecastWindText}>
          {wind}
          {windUnit}
        </Text>
      </View>
    </View>
  );
};

// Props for the updated WeatherItem component
interface WeatherItemProps {
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    wind_speed_10m: number[];
  };
  units?: {
    temperature_2m?: string;
    wind_speed_10m?: string;
  };
}

const WeatherItems = ({hourly, units}: WeatherItemProps) => {
  if (!hourly || !hourly.time || hourly.time.length === 0) {
    return <Text>Hourly forecast data is not available.</Text>; // Or return null
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      // style={styles.hourlyScrollView}
    >
      {hourly.time.map((time, index) => {
        const temp = hourly.temperature_2m?.[index];
        const code = hourly.weather_code?.[index];
        const wind = hourly.wind_speed_10m?.[index];

        if (temp === undefined || code === undefined || wind === undefined) {
          return null;
        }

        return (
          <HourlyWeatherCard
            key={time}
            time={time}
            temperature={temp}
            weatherCode={code}
            temperatureUnit={units?.temperature_2m ?? '°C'}
            wind={wind}
            windUnit={units?.wind_speed_10m ?? 'km/h'}
          />
        );
      })}
    </ScrollView>
  );
};

interface temperatureChartPoint {
  value: number;
  label?: string;
}

export const TodayForecast = (weather: WeatherData) => {
  const {dimension, direction} = useAppContext();

  const chartsData: temperatureChartPoint[] = [];
  if (weather.hourly === undefined) {
    return (
      <View>
        <ActivityIndicator />
        <Text>Loading weather...</Text>
      </View>
    );
  }
  weather.hourly?.time.map((time, index) => {
    const hour = new Date(time).getHours();
    const point: temperatureChartPoint = {
      value: Number(weather.hourly?.temperature_2m[index]),
    };
    // Label each 4h
    if (index % 4 === 0) {
      point.label = hour.toString();
    }
    chartsData.push(point);
  });

  const chartContentWidth =
    dimension.width > 0
      ? dimension.width - 50 - styles.temperatureCharts.padding * 2
      : 0;

  const gradientTemperature = () => {
    return (
      <LinearGradient id="ggrd" x1="0" y1="0" x2={'0'} y2={'1'}>
        <Stop offset="0" stopColor={'orange'} />
        <Stop offset="0.5" stopColor={'cyan'} />
        <Stop offset="1" stopColor={'blue'} />
      </LinearGradient>
    );
  };

  const content = (
    <>
      <View style={styles.temperatureCharts}>
        <Text style={styles.yAxisTitle}>Temperature (°C)</Text>
        <LineChart
          isAnimated
          data={chartsData}
          adjustToWidth
          width={chartContentWidth}
          initialSpacing={0}
          endSpacing={0}
          xAxisLabelTextStyle={styles.xAxisLabel}
          rulesType="solid"
          hideDataPoints
          lineGradient
          lineGradientId="ggrd"
          lineGradientComponent={gradientTemperature}
        />
        <Text style={styles.xAxisTitle}>Hours of Day</Text>
      </View>
      <View style={styles.weatherItems}>
        <WeatherItems hourly={weather.hourly} />
      </View>
    </>
  );

  return (
    <>
      <View style={styles.container}>
        {direction === 'row' ? (
          <ScrollView>{content}</ScrollView>
        ) : (
          <>{content}</>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 30,
  },
  temperatureCharts: {
    padding: 20,
  },
  yAxisTitle: {
    textAlign: 'left',
    fontSize: 14,
    color: 'grey',
    marginBottom: 10,
  },
  xAxisTitle: {
    textAlign: 'center',
    fontSize: 14,
    color: 'grey',
    marginTop: 5,
  },
  xAxisLabel: {
    color: 'black',
    fontSize: 10,
  },
  // Weather Items
  weatherItems: {
    flexDirection: 'row',
  },
  weatherCard: {
    backgroundColor: theme.colors.primary + 'a8',
    minWidth: 100,
    borderRadius: theme.borderRadius.large,
    borderWidth: 1.5,
    marginHorizontal: 5,
    padding: 5,
  },
  forecastTemperatureText: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  forecastWindText: {
    fontSize: 20,
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
