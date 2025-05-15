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
  };
  hourly_units?: {
    temperature_2m: string;
  };
}

export const useWeatherData = (toSearch: Position, periode?: Page) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WeatherData | null>(null);

  /**
   * Weather API: https://open-meteo.com/en/docs#api_documentation
   * Current: https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,weather_code,wind_speed_10m
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

    const params = new URLSearchParams({
      latitude: String(toSearch.coords.latitude),
      longitude: String(toSearch.coords.longitude),
    });
    const apiUrl = `${endpoint}?${params.toString()}`;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`API response: HTTP Status ${response.status}`);
        }

        const json: WeatherErrorResponse | WeatherData = await response.json();

        if ('error' in json && json.error) {
          throw new Error(json.reason);
        }
        setData(json as WeatherData);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toSearch]);

  return {loading, error, data};
};
