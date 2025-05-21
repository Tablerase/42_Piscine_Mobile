import {useAppContext} from '@contexts/AppContext';
import {WeatherData} from '@hooks/useWeatherData';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {LineChart} from 'react-native-gifted-charts';
import {Stop, LinearGradient} from 'react-native-svg';

// const WeatherItem = (weatherData: {
//   weather_code?: number;
//   temperature?: number;
//   temperature_unit?: string;
//   wind_speed?: number;
//   wind_speed_unit?: string;
// }) => {
//   return (
//     <View style={styles.weatherItemRow}>
//       <Text style={styles.forecastItem}>
//         {String(getWeatherDescription(weatherData.weather_code, true))}
//       </Text>
//       <Text style={styles.forecastItem}>
//         {weatherData.temperature ?? '--'}
//         {weatherData.temperature_unit ?? ''}
//       </Text>
//       <Text style={styles.forecastItem}>
//         {weatherData.wind_speed ?? '--'}
//         {weatherData.wind_speed_unit ?? ''}
//       </Text>
//     </View>
//   );
// };

interface temperatureChartPoint {
  value: number;
  label?: string;
}

export const TodayForecast = (weather: WeatherData) => {
  const {dimension, direction} = useAppContext();

  const chartsData: temperatureChartPoint[] = [];
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
    <View style={styles.temperatureCharts}>
      <LineChart
        isAnimated
        data={chartsData}
        adjustToWidth
        width={chartContentWidth}
        initialSpacing={0}
        endSpacing={0}
        xAxisLabelTextStyle={{color: 'black', fontSize: 10}}
        rulesType="solid"
        hideDataPoints
        lineGradient
        lineGradientId="ggrd"
        lineGradientComponent={gradientTemperature}
      />
    </View>
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
});
