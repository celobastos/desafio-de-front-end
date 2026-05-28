import type { City } from "@/lib/cities";
import { WeatherApiError } from "./errors";
import type { PeriodWeather, WeatherDetails, WeatherMood } from "./types";
import type { WeatherApiHour, WeatherApiResponse } from "./weatherapi-types";

export function getWeatherMood(condition: string): WeatherMood {
  const normalizedCondition = condition.toLowerCase();
  return normalizedCondition.includes("sunny") || normalizedCondition.includes("clear") ? "good" : "bad";
}

export function getWeatherForHour(hours: WeatherApiHour[], hour: PeriodWeather["time"]): WeatherApiHour {
  const match = hours.find((entry) => entry.time.endsWith(` ${hour}`));

  if (!match) {
    throw new WeatherApiError(`Weather data for ${hour} was not returned by the API.`);
  }

  return match;
}

export function normalizeWeatherResponse(city: City, payload: WeatherApiResponse): WeatherDetails {
  const [today] = payload.forecast.forecastday;

  if (!today) {
    throw new WeatherApiError("Forecast data was not returned by the API.");
  }

  const periodDefinitions = [
    { label: "Dawn", time: "03:00" },
    { label: "Morning", time: "09:00" },
    { label: "Afternoon", time: "15:00" },
    { label: "Night", time: "21:00" },
  ] as const satisfies readonly Pick<PeriodWeather, "label" | "time">[];

  const normalizePeriod = (period: Pick<PeriodWeather, "label" | "time">): PeriodWeather => {
    const weather = getWeatherForHour(today.hour, period.time);

    return {
      ...period,
      temperatureC: weather.temp_c,
      condition: weather.condition.text,
    };
  };

  return {
    city,
    locationName: payload.location.name,
    country: payload.location.country,
    localTime: payload.location.localtime,
    lastUpdated: payload.current.last_updated,
    currentTemperatureC: payload.current.temp_c,
    currentWeather: payload.current.condition.text,
    mood: getWeatherMood(payload.current.condition.text),
    windSpeedKph: payload.current.wind_kph,
    humidity: payload.current.humidity,
    sunrise: today.astro.sunrise,
    sunset: today.astro.sunset,
    maxTemperatureC: today.day.maxtemp_c,
    minTemperatureC: today.day.mintemp_c,
    periods: [
      normalizePeriod(periodDefinitions[0]),
      normalizePeriod(periodDefinitions[1]),
      normalizePeriod(periodDefinitions[2]),
      normalizePeriod(periodDefinitions[3]),
    ],
  };
}
