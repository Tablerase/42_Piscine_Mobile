export interface weatherCodeItem {
  desc: string;
  emojis: string;
}

const weatherCodeDescriptions: {[key: number]: weatherCodeItem} = {
  0: {desc: 'Clear sky', emojis: '☀️'},
  1: {desc: 'Mainly clear', emojis: '🌤️'},
  2: {desc: 'Partly cloudy', emojis: '⛅'},
  3: {desc: 'Overcast', emojis: '☁️'},
  45: {desc: 'Fog', emojis: '🌫️'},
  48: {desc: 'Depositing rime fog', emojis: '🌫️❄️'},
  51: {desc: 'Light drizzle', emojis: '🌦️'},
  53: {desc: 'Moderate drizzle', emojis: '🌦️'},
  55: {desc: 'Dense drizzle', emojis: '🌧️'},
  56: {desc: 'Light freezing drizzle', emojis: '🌧️❄️'},
  57: {desc: 'Dense freezing drizzle', emojis: '🌧️❄️'},
  61: {desc: 'Slight rain', emojis: '🌦️'},
  63: {desc: 'Moderate rain', emojis: '🌧️'},
  65: {desc: 'Heavy rain', emojis: '🌧️💧'},
  66: {desc: 'Light freezing rain', emojis: '🌧️❄️'},
  67: {desc: 'Heavy freezing rain', emojis: '🌧️❄️'},
  71: {desc: 'Slight snow fall', emojis: '🌨️'},
  73: {desc: 'Moderate snow fall', emojis: '🌨️'},
  75: {desc: 'Heavy snow fall', emojis: '❄️'},
  77: {desc: 'Snow grains', emojis: '🌨️'},
  80: {desc: 'Slight rain showers', emojis: '🌦️'},
  81: {desc: 'Moderate rain showers', emojis: '🌧️'},
  82: {desc: 'Violent rain showers', emojis: '⛈️'},
  85: {desc: 'Slight snow showers', emojis: '🌨️'},
  86: {desc: 'Heavy snow showers', emojis: '❄️'},
  95: {desc: 'Thunderstorm', emojis: '⛈️'},
  96: {desc: 'Thunderstorm with slight hail', emojis: '⛈️🌨️'},
  99: {desc: 'Thunderstorm with heavy hail', emojis: '⛈️❄️'},
};

export function getWeatherDescription(
  code?: number,
  stringified: boolean = true,
): string | weatherCodeItem {
  if (stringified === true) {
    if (code === undefined) {
      return 'Unknown weather';
    }
    const item = weatherCodeDescriptions[code];
    if (item) {
      return `${item.desc} ${item.emojis}`;
    }
    return 'Unknown weather';
  } else {
    if (code === undefined) {
      return {desc: 'Unknown weather', emojis: '?'};
    }
    const item = weatherCodeDescriptions[code];
    if (item) {
      return item;
    }
    return {desc: 'Unknown weather', emojis: '?'};
  }
}
