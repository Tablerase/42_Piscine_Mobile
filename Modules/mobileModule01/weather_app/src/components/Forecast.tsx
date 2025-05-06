import {theme} from '@styles/theme';
import {StyleSheet, Text, View} from 'react-native';

interface ForecastProps {
  period: string;
  location: string;
}

export const Forecast = ({period, location}: ForecastProps) => {
  return (
    <>
      <View style={styles.forecast}>
        <Text style={styles.forecastText}>{period}</Text>
        <Text style={styles.forecastText}>{location}</Text>
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
});
