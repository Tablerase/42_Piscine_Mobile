import {theme} from '@styles/theme';

export const getTemperatureColor = (
  temperature: number | undefined,
): string => {
  if (temperature === undefined) {
    return theme.colors.text.primary;
  }
  if (temperature <= 0) {
    return theme.colors.temperature.cold;
  } else if (temperature <= 15) {
    return theme.colors.temperature.cool;
  } else if (temperature <= 25) {
    return theme.colors.temperature.moderate;
  } else if (temperature <= 35) {
    return theme.colors.temperature.warm;
  } else {
    return theme.colors.temperature.hot;
  }
};
