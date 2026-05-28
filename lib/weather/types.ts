import type { City } from "@/lib/cities";

export type WeatherMood = "good" | "bad";

export type PeriodWeather = {
  label: "Dawn" | "Morning" | "Afternoon" | "Night";
  time: "03:00" | "09:00" | "15:00" | "21:00";
  temperatureC: number;
  condition: string;
};

export type WeatherPeriods = [PeriodWeather, PeriodWeather, PeriodWeather, PeriodWeather];

export type WeatherDetails = {
  city: City;
  locationName: string;
  country: string;
  localTime: string;
  lastUpdated: string;
  currentTemperatureC: number;
  currentWeather: string;
  mood: WeatherMood;
  windSpeedKph: number;
  humidity: number;
  sunrise: string;
  sunset: string;
  maxTemperatureC: number;
  minTemperatureC: number;
  periods: WeatherPeriods;
};
