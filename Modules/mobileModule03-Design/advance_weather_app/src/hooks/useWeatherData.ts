import {Page, Position} from '@contexts/AppContext';
import {useEffect, useState} from 'react';

export interface weatherType {}

/**
 * Represents the error response from the Geocoding API.
 */
interface WeatherErrorResponse {
  error: boolean;
  reason: string;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  elevation: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  hourly?: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    wind_speed_10m: number[];
  };
  hourly_units?: {
    time: string;
    temperature_2m: string;
    weather_code: string;
    wind_speed_10m: string;
  };
  daily_units?: {
    time: string;
    weather_code: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
  };
  daily?: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
  current_units?: {
    time: string;
    interval: string;
    temperature_2m: string;
    weather_code: string;
    wind_speed_10m: string;
  };
  current?: {
    time: string;
    temperature_2m?: number;
    weather_code?: number;
    wind_speed_10m?: number;
  };
}

const currentParams = ['temperature_2m', 'weather_code', 'wind_speed_10m'];
const todayParams = {
  hourly: ['temperature_2m', 'weather_code', 'wind_speed_10m'],
  forecast_days: 1,
};
const weeklyParams = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
];

export const useWeatherData = (
  toSearch: Position,
  periode: Page = Page.Currently,
) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WeatherData | null>(null);

  /**
   * Weather API: https://open-meteo.com/en/docs#api_documentation
   * Current: https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,weather_code,wind_speed_10m
   * Today: https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,weather_code,wind_speed_10m&forecast_days=1
   * Weekly: https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=weather_code,temperature_2m_max,temperature_2m_min
   */
  const endpoint = 'https://api.open-meteo.com/v1/forecast';
  useEffect(() => {
    if (
      !toSearch ||
      typeof toSearch.coords?.latitude !== 'number' ||
      typeof toSearch.coords.longitude !== 'number'
    ) {
      setData(null);
      setLoading(false);
      setError('Invalid coordinates');
      return;
    }

    const coords = new URLSearchParams({
      latitude: toSearch.coords.latitude.toString(),
      longitude: toSearch.coords.longitude.toString(),
    });
    let params = new URLSearchParams();
    if (periode === Page.Currently) {
      params = new URLSearchParams({
        current: currentParams.join(','),
      });
    } else if (periode === Page.Today) {
      params = new URLSearchParams({
        hourly: todayParams.hourly.join(','),
        forecast_days: todayParams.forecast_days.toString(),
      });
    } else if (periode === Page.Weekly) {
      params = new URLSearchParams({
        daily: weeklyParams.join(','),
      });
    }

    const apiUrl = `${endpoint}?${coords.toString()}&${params.toString()}`;

    const fetchData = async () => {
      setLoading(true);

      const controller = new AbortController();
      const timeoutDuration = 5000;

      const timeoutId = setTimeout(() => {
        controller.abort();
      }, timeoutDuration);
      try {
        const response = await fetch(apiUrl, {signal: controller.signal});
        if (!response.ok) {
          console.log(response);
          throw new Error(`API response: HTTP Status ${response.status}`);
        }

        const json: WeatherErrorResponse | WeatherData = await response.json();

        if ('error' in json && json.error) {
          throw new Error(json.reason);
        }
        setData(json as WeatherData);
      } catch (err: any) {
        console.log(err);
        if (err.name === 'AbortError' || err.message === 'Aborted') {
          setError(
            'Weather forecast request timed out! Please check your internet connection or try again later.',
          );
        } else if (
          typeof err.message === 'string' &&
          (err.message.toLowerCase().includes('network request failed') || // Common in React Native
            err.message.toLowerCase().includes('failed to fetch')) // Common in browsers/some environments
        ) {
          setError('No internet connection or server unreachable.');
        } else {
          setError(err.message || 'Unknown error');
        }
        setData(null);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };
    fetchData();
  }, [toSearch, periode]);

  return {loading, error, data};
};
