import {useEffect, useState} from 'react';

/**
 * Represents a single location result from the Geocoding API.
 */
export interface GeocodingLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code: string;
  country_code: string;
  admin1_id?: number;
  admin2_id?: number;
  admin3_id?: number;
  admin4_id?: number;
  timezone: string;
  population?: number;
  postcodes?: string[];
  country_id: number;
  country: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  admin4?: string;
}

/**
 * Represents the successful response from the Geocoding API.
 */
interface GeocodingSuccessResponse {
  results: GeocodingLocation[];
}

/**
 * Represents the error response from the Geocoding API.
 */
interface GeocodingErrorResponse {
  error: boolean;
  reason: string;
}

export const useCitiesList = (city: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<GeocodingLocation[]>([]); // Store full location objects or adjust as needed

  /**
   * Fetches a list of cities from the Open-Meteo Geocoding API.
   * @param {string} cityName - The name of the city to search for.
   * @param {number} [count=10] - The number of search results to return (1-100).
   * @param {string} [language='en'] - The language for the results.
   * @param {string} [countryCode] - ISO-3166-1 alpha2 country code to filter results.
   * @returns {Promise<void>}
   * Geocode API: https://open-meteo.com/en/docs/geocoding-api#attribution
   */
  const endpoint = 'https://geocoding-api.open-meteo.com/v1/search';
  const count = 5;
  // Consider adding count, language, etc., as parameters to the hook if they need to be dynamic
  const apiUrl = `${endpoint}?name=${encodeURIComponent(
    city,
  )}&count=${count}&language=en`; // Example with count and language

  useEffect(() => {
    if (!city) {
      setCities([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null); // Clear previous errors

      const controller = new AbortController();
      const timeoutDuration = 5000;
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, timeoutDuration);
      try {
        const response = await fetch(apiUrl, {signal: controller.signal});
        if (!response.ok) {
          throw new Error(`API fetch: HTTP status - ${response.status}`);
        }

        const json: GeocodingSuccessResponse | GeocodingErrorResponse =
          await response.json();

        if ('error' in json && json.error) {
          throw new Error(json.reason);
        }

        if ('results' in json && json.results) {
          // If you only want city names:
          // setCities(json.results.map(location => `${location.name}, ${location.country}`));
          // Or store the full location objects:
          setCities(json.results);
        } else {
          setCities([]);
        }
      } catch (err: any) {
        if (err.message === 'Aborted') {
          setError('Fetch City request timeout');
        } else {
          setError(err.message || 'An unknown error occurred');
        }
        setCities([]);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, city]);

  return {loading, error, cities};
};
