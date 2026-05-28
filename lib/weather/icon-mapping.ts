import type { WeatherAssetName } from "@/components/WeatherAssetIcon";
import type { PeriodWeather } from "./types";

export function getAssetForCondition(condition: string, periodLabel?: PeriodWeather["label"]): WeatherAssetName {
  const normalized = condition.toLowerCase();

  if (periodLabel === "Night") {
    return normalized.includes("cloud") ? "cloud-moon" : "moon";
  }

  if (normalized.includes("thunder") || normalized.includes("lightning")) {
    return normalized.includes("rain") ? "lightning-rain" : "lightning";
  }

  if (normalized.includes("snow") || normalized.includes("blizzard")) {
    return "snow";
  }

  if (normalized.includes("sleet") || normalized.includes("ice pellet")) {
    return "sleet";
  }

  if (normalized.includes("hail")) {
    return "hail";
  }

  if (normalized.includes("heavy rain")) {
    return "heavy-rain";
  }

  if (normalized.includes("rain")) {
    return "rain";
  }

  if (normalized.includes("drizzle")) {
    return "drizzle";
  }

  if (normalized.includes("fog") || normalized.includes("mist")) {
    return "fog";
  }

  if (normalized.includes("haze")) {
    return "haze";
  }

  if (normalized.includes("partly") || normalized.includes("sunny intervals")) {
    return "cloud-sun";
  }

  if (normalized.includes("cloudy") || normalized.includes("overcast")) {
    return "cloudy";
  }

  if (normalized.includes("cloud")) {
    return "cloud";
  }

  return "sun";
}

export function getPeriodAsset(period: PeriodWeather): WeatherAssetName {
  return getAssetForCondition(period.condition, period.label);
}
