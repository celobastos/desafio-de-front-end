import { getCityById } from "@/lib/cities";
import { WeatherApiError } from "./errors";
import { normalizeWeatherResponse } from "./normalize";
import type { WeatherDetails } from "./types";
import { parseWeatherApiResponse } from "./weatherapi-types";

const WEATHER_API_BASE_URL = "https://api.weatherapi.com/v1";

export async function getWeatherDetails(cityId: string): Promise<WeatherDetails> {
  const city = getCityById(cityId);

  if (!city) {
    throw new WeatherApiError("City not found.", 404);
  }

  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    throw new WeatherApiError("Missing WEATHER_API_KEY environment variable.", 500);
  }

  const params = new URLSearchParams({
    key: apiKey,
    q: `${city.latitude},${city.longitude}`,
    days: "1",
    aqi: "no",
    alerts: "no",
  });

  const response = await fetch(`${WEATHER_API_BASE_URL}/forecast.json?${params.toString()}`, {
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new WeatherApiError("Unable to load weather data.", response.status);
  }

  const payload = parseWeatherApiResponse(await response.json());
  return normalizeWeatherResponse(city, payload);
}
