import { cities } from "@/lib/cities";
import {
  getAssetForCondition,
  getWeatherMood,
  normalizeWeatherResponse,
  parseWeatherApiResponse,
  WeatherApiError,
} from "@/lib/weather";

function buildHours() {
  return Array.from({ length: 24 }, (_, hour) => ({
    time: `2026-05-25 ${String(hour).padStart(2, "0")}:00`,
    temp_c: hour,
    condition: {
      text: hour === 21 ? "Clear" : "Sunny",
    },
  }));
}

describe("weather normalization", () => {
  it("maps WeatherAPI forecast data to the internal details shape", () => {
    const city = cities[0];
    const weather = normalizeWeatherResponse(city, {
      location: {
        name: "Dallol",
        country: "Niger",
        localtime: "2026-05-25 10:30",
      },
      current: {
        last_updated: "2026-05-25 10:15",
        temp_c: 31.4,
        condition: {
          text: "Sunny",
        },
        wind_kph: 18.6,
        humidity: 41,
      },
      forecast: {
        forecastday: [
          {
            day: {
              maxtemp_c: 34.2,
              mintemp_c: 22.8,
            },
            astro: {
              sunrise: "05:55 AM",
              sunset: "06:41 PM",
            },
            hour: buildHours(),
          },
        ],
      },
    });

    expect(weather.currentTemperatureC).toBe(31.4);
    expect(weather.currentWeather).toBe("Sunny");
    expect(weather.mood).toBe("good");
    expect(weather.windSpeedKph).toBe(18.6);
    expect(weather.humidity).toBe(41);
    expect(weather.sunrise).toBe("05:55 AM");
    expect(weather.sunset).toBe("06:41 PM");
    expect(weather.maxTemperatureC).toBe(34.2);
    expect(weather.minTemperatureC).toBe(22.8);
    expect(weather.periods.map((period) => period.temperatureC)).toEqual([3, 9, 15, 21]);
  });

  it("classifies clear and sunny weather as good", () => {
    expect(getWeatherMood("Clear")).toBe("good");
    expect(getWeatherMood("Sunny")).toBe("good");
    expect(getWeatherMood("Snow")).toBe("bad");
  });

  it("maps weather conditions to icon names", () => {
    expect(getAssetForCondition("Sunny")).toBe("sun");
    expect(getAssetForCondition("Clear", "Night")).toBe("moon");
    expect(getAssetForCondition("Partly cloudy", "Night")).toBe("cloud-moon");
    expect(getAssetForCondition("Patchy rain nearby")).toBe("rain");
    expect(getAssetForCondition("Heavy rain")).toBe("heavy-rain");
    expect(getAssetForCondition("Blizzard")).toBe("snow");
    expect(getAssetForCondition("Sleet")).toBe("sleet");
    expect(getAssetForCondition("Hail")).toBe("hail");
    expect(getAssetForCondition("Fog")).toBe("fog");
    expect(getAssetForCondition("Haze")).toBe("haze");
    expect(getAssetForCondition("Thunderstorm with rain")).toBe("lightning-rain");
    expect(getAssetForCondition("Lightning")).toBe("lightning");
  });

  it("rejects WeatherAPI payloads without forecast data", () => {
    expect(() => parseWeatherApiResponse({})).toThrow(WeatherApiError);
  });

  it("rejects WeatherAPI payloads with an empty forecast day list", () => {
    expect(() =>
      parseWeatherApiResponse({
        location: {
          name: "Recife",
          country: "Brazil",
          localtime: "2026-05-25 13:00",
        },
        current: {
          last_updated: "2026-05-25 12:45",
          temp_c: 28.6,
          condition: {
            text: "Partly cloudy",
          },
          wind_kph: 17.2,
          humidity: 76,
        },
        forecast: {
          forecastday: [],
        },
      }),
    ).toThrow(WeatherApiError);
  });

  it("rejects WeatherAPI payloads without the current condition text", () => {
    expect(() =>
      parseWeatherApiResponse({
        location: {
          name: "Recife",
          country: "Brazil",
          localtime: "2026-05-25 13:00",
        },
        current: {
          last_updated: "2026-05-25 12:45",
          temp_c: 28.6,
          condition: {},
          wind_kph: 17.2,
          humidity: 76,
        },
        forecast: {
          forecastday: [
            {
              day: {
                maxtemp_c: 31.2,
                mintemp_c: 24.1,
              },
              astro: {
                sunrise: "05:22 AM",
                sunset: "05:07 PM",
              },
              hour: buildHours(),
            },
          ],
        },
      }),
    ).toThrow(WeatherApiError);
  });
});
