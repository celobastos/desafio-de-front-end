import { notFound } from "next/navigation";
import { WeatherApiError } from "./errors";
import { getWeatherDetails } from "./client";
import type { WeatherDetails } from "./types";

export async function loadCityWeather(cityId: string): Promise<WeatherDetails> {
  try {
    return await getWeatherDetails(cityId);
  } catch (error) {
    if (error instanceof WeatherApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }
}
