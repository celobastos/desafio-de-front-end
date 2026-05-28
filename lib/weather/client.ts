import { getCityById } from "@/lib/cities";
import { getErrorDetails, logServerEvent } from "@/lib/server-logger";
import { WeatherApiError } from "./errors";
import { normalizeWeatherResponse } from "./normalize";
import type { WeatherDetails } from "./types";
import { parseWeatherApiResponse } from "./weatherapi-types";

const WEATHER_API_BASE_URL = "https://api.weatherapi.com/v1";

export async function getWeatherDetails(cityId: string): Promise<WeatherDetails> {
  const city = getCityById(cityId);

  if (!city) {
    logServerEvent("warn", "weather_city_not_found", { cityId });
    throw new WeatherApiError("City not found.", 404);
  }

  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    logServerEvent("error", "weather_api_key_missing", { cityId });
    throw new WeatherApiError("Missing WEATHER_API_KEY environment variable.", 500);
  }

  const params = new URLSearchParams({
    key: apiKey,
    q: `${city.latitude},${city.longitude}`,
    days: "1",
    aqi: "no",
    alerts: "no",
  });

  let response: Response;

  try {
    response = await fetch(`${WEATHER_API_BASE_URL}/forecast.json?${params.toString()}`, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 300 },
    });
  } catch (error) {
    logServerEvent("error", "weather_api_request_error", {
      cityId,
      provider: "weatherapi",
      ...getErrorDetails(error),
    });

    throw error;
  }

  if (!response.ok) {
    logServerEvent("error", "weather_api_response_error", {
      cityId,
      provider: "weatherapi",
      status: response.status,
    });

    throw new WeatherApiError("Unable to load weather data.", response.status);
  }

  let payload: ReturnType<typeof parseWeatherApiResponse>;

  try {
    payload = parseWeatherApiResponse(await response.json());
  } catch (error) {
    logServerEvent("error", "weather_api_payload_invalid", {
      cityId,
      provider: "weatherapi",
      ...getErrorDetails(error),
    });

    throw error;
  }

  return normalizeWeatherResponse(city, payload);
}
