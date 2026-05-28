import { WeatherApiError } from "./errors";

export type WeatherApiHour = {
  time: string;
  temp_c: number;
  condition: {
    text: string;
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readRecord(source: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = source[key];

  if (!isRecord(value)) {
    throw new WeatherApiError("Invalid weather API response.", 502);
  }

  return value;
}

function readArray(source: Record<string, unknown>, key: string): unknown[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    throw new WeatherApiError("Invalid weather API response.", 502);
  }

  return value;
}

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];

  if (typeof value !== "string") {
    throw new WeatherApiError("Invalid weather API response.", 502);
  }

  return value;
}

function readNumber(source: Record<string, unknown>, key: string): number {
  const value = source[key];

  if (typeof value !== "number") {
    throw new WeatherApiError("Invalid weather API response.", 502);
  }

  return value;
}

function parseWeatherApiHour(payload: unknown): WeatherApiHour {
  if (!isRecord(payload)) {
    throw new WeatherApiError("Invalid weather API response.", 502);
  }

  const condition = readRecord(payload, "condition");

  return {
    time: readString(payload, "time"),
    temp_c: readNumber(payload, "temp_c"),
    condition: {
      text: readString(condition, "text"),
    },
  };
}

export function parseWeatherApiResponse(payload: unknown): WeatherApiResponse {
  if (!isRecord(payload)) {
    throw new WeatherApiError("Invalid weather API response.", 502);
  }

  const location = readRecord(payload, "location");
  const current = readRecord(payload, "current");
  const currentCondition = readRecord(current, "condition");
  const forecast = readRecord(payload, "forecast");
  const forecastday = readArray(forecast, "forecastday");

  if (forecastday.length === 0) {
    throw new WeatherApiError("Invalid weather API response.", 502);
  }

  return {
    location: {
      name: readString(location, "name"),
      country: readString(location, "country"),
      localtime: readString(location, "localtime"),
    },
    current: {
      last_updated: readString(current, "last_updated"),
      temp_c: readNumber(current, "temp_c"),
      condition: {
        text: readString(currentCondition, "text"),
      },
      wind_kph: readNumber(current, "wind_kph"),
      humidity: readNumber(current, "humidity"),
    },
    forecast: {
      forecastday: forecastday.map((entry) => {
        if (!isRecord(entry)) {
          throw new WeatherApiError("Invalid weather API response.", 502);
        }

        const day = readRecord(entry, "day");
        const astro = readRecord(entry, "astro");

        return {
          day: {
            maxtemp_c: readNumber(day, "maxtemp_c"),
            mintemp_c: readNumber(day, "mintemp_c"),
          },
          astro: {
            sunrise: readString(astro, "sunrise"),
            sunset: readString(astro, "sunset"),
          },
          hour: readArray(entry, "hour").map(parseWeatherApiHour),
        };
      }),
    },
  };
}

export type WeatherApiResponse = {
  location: {
    name: string;
    country: string;
    localtime: string;
  };
  current: {
    last_updated: string;
    temp_c: number;
    condition: {
      text: string;
    };
    wind_kph: number;
    humidity: number;
  };
  forecast: {
    forecastday: Array<{
      day: {
        maxtemp_c: number;
        mintemp_c: number;
      };
      astro: {
        sunrise: string;
        sunset: string;
      };
      hour: WeatherApiHour[];
    }>;
  };
};
