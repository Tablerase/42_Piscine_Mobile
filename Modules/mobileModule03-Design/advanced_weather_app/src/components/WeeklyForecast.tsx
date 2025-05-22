import {useAppContext} from '@contexts/AppContext';
import {WeatherData} from '@hooks/useWeatherData';
import {theme} from '@styles/theme';
import {getTemperatureColor} from '@utils/temperatureColor';
import {
  getWeatherDescription,
  weatherCodeItem,
} from '@utils/weatherDescription';
import {StyleSheet, View, Text} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {LineChart} from 'react-native-gifted-charts';

interface DailyCardProps {
  time: string;
  temperatureMin: number;
  temperatureMax: number;
  weatherCode: number;
  temperatureUnit?: string;
}

const DailyWeatherCard = ({
  time,
  temperatureMin,
  temperatureMax,
  weatherCode,
  temperatureUnit,
}: DailyCardProps) => {
  const displayTime = new Date(time).toLocaleDateString([], {
    day: '2-digit',
    month: '2-digit',
  });

  // Example: const { iconName, description } = getWeatherInfo(weatherCode);
  // For now, using placeholders.
  const weatherDescription: weatherCodeItem = getWeatherDescription(
    weatherCode,
    false,
  ) as weatherCodeItem;
  const iconPlaceholder = weatherDescription.emojis;
  // const descriptionPlaceholder = weatherDescription.desc;
  const temperatureColor = getTemperatureColor(temperatureMax);

  return (
    <View style={[styles.weatherCard, {borderColor: temperatureColor}]}>
      <Text style={styles.forecastDescriptionText}>{displayTime}</Text>
      <Text style={styles.forecastDescriptionEmojis}>{iconPlaceholder}</Text>
      <Text style={[styles.forecastTemperatureMaxText]}>
        {temperatureMax.toFixed(0)}
        {temperatureUnit}
      </Text>
      <Text style={[styles.forecastTemperatureMinText]}>
        {temperatureMin.toFixed(0)}
        {temperatureUnit}
      </Text>

      {/* <Text style={styles.forecastDescriptionText}>{descriptionPlaceholder}</Text> */}
    </View>
  );
};

interface WeatherItemProps extends Pick<WeatherData, 'daily' | 'daily_units'> {}

const WeatherItems = ({daily, daily_units}: WeatherItemProps) => {
  if (!daily || !daily.time || daily.time.length === 0) {
    return <Text>Daily forecast data is not available.</Text>;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      // style={styles.dailyScrollView}
    >
      {daily.time.map((time, index) => {
        const temperatureMax = daily.temperature_2m_max?.[index];
        const code = daily.weather_code?.[index];
        const temperatureMin = daily.temperature_2m_min?.[index];

        if (
          temperatureMax === undefined ||
          code === undefined ||
          temperatureMin === undefined
        ) {
          return null;
        }

        return (
          <DailyWeatherCard
            key={time}
            time={time}
            temperatureMax={temperatureMax}
            temperatureMin={temperatureMin}
            weatherCode={code}
            temperatureUnit={daily_units?.temperature_2m_max ?? '°C'}
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

export const WeeklyForecast = (weather: WeatherData) => {
  const {dimension, direction} = useAppContext();

  if (weather.daily === undefined) {
    return (
      <View>
        <Text>Error recovering daily weather data</Text>
      </View>
    );
  }
  const chartsData: temperatureChartPoint[] = [];
  const chartsDataMin: temperatureChartPoint[] = [];
  weather.daily?.time.map((time, index) => {
    const displayTime = new Date(time).toLocaleDateString([], {
      day: '2-digit',
      month: '2-digit',
    });

    const point: temperatureChartPoint = {
      value: Number(weather.daily?.temperature_2m_max[index]),
    };
    const pointMin: temperatureChartPoint = {
      value: Number(weather.daily?.temperature_2m_min[index]),
    };
    point.label = displayTime;
    chartsData.push(point);
    chartsDataMin.push(pointMin);
  });

  const chartContentWidth =
    dimension.width > 0
      ? dimension.width - 50 - styles.temperatureCharts.padding * 2
      : 0;

  const content = (
    <>
      <View style={styles.temperatureCharts}>
        <Text style={styles.yAxisTitle}>Temperature (°C)</Text>
        <LineChart
          isAnimated
          data={chartsData}
          color1={theme.colors.temperature.warm}
          dataPointsColor1={theme.colors.temperature.hot}
          data2={chartsDataMin}
          color2={theme.colors.temperature.cool}
          dataPointsColor2={theme.colors.temperature.cold}
          adjustToWidth
          width={chartContentWidth}
          initialSpacing={0}
          endSpacing={0}
          xAxisLabelTextStyle={styles.xAxisLabel}
          rulesType="solid"
          // hideDataPoints
        />
        <Text style={styles.xAxisTitle}>Days of week</Text>
      </View>
      <View style={styles.weatherItems}>
        <WeatherItems daily={weather.daily} />
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
  forecastTemperatureMaxText: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    color: theme.colors.temperature.hot,
  },
  forecastTemperatureMinText: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    color: theme.colors.temperature.cool,
  },
  forecastDescriptionText: {
    fontSize: 30,
    textAlign: 'center',
  },
  forecastDescriptionEmojis: {
    fontSize: 90,
    textAlign: 'center',
  },
});
