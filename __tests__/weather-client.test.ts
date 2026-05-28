import { notFound } from "next/navigation";
import { cities } from "@/lib/cities";
import { getWeatherDetails, loadCityWeather, WeatherApiError } from "@/lib/weather";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

const originalWeatherApiKey = process.env.WEATHER_API_KEY;
const fetchMock = jest.fn();

function buildWeatherApiPayload() {
  return {
    location: {
      name: "Recife",
      country: "Brazil",
      localtime: "2026-05-25 13:00",
    },
    current: {
      last_updated: "2026-05-25 12:45",
      temp_c: 28.6,
      condition: {
        text: "Sunny",
      },
      wind_kph: 12.6,
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
          hour: Array.from({ length: 24 }, (_, hour) => ({
            time: `2026-05-25 ${String(hour).padStart(2, "0")}:00`,
            temp_c: hour,
            condition: {
              text: hour === 21 ? "Clear" : "Sunny",
            },
          })),
        },
      ],
    },
  };
}

beforeEach(() => {
  process.env.WEATHER_API_KEY = "test-api-key";
  fetchMock.mockReset();
  (notFound as jest.Mock).mockClear();
  global.fetch = fetchMock;
});

afterAll(() => {
  process.env.WEATHER_API_KEY = originalWeatherApiKey;
});

describe("weather API client", () => {
  it("loads and normalizes weather data for a known city", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => buildWeatherApiPayload(),
    });

    const weather = await getWeatherDetails("recife");
    const [url, init] = fetchMock.mock.calls[0];

    expect(weather.city).toBe(cities[3]);
    expect(weather.currentWeather).toBe("Sunny");
    expect(weather.windSpeedKph).toBe(12.6);
    expect(String(url)).toContain("key=test-api-key");
    expect(String(url)).toContain("q=-8.04756%2C-34.877");
    expect(init).toMatchObject({
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });
  });

  it("rejects unknown city ids before calling the API", async () => {
    await expect(getWeatherDetails("missing")).rejects.toMatchObject({
      name: "WeatherApiError",
      status: 404,
    });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects requests when the API key is missing", async () => {
    delete process.env.WEATHER_API_KEY;

    await expect(getWeatherDetails("recife")).rejects.toMatchObject({
      name: "WeatherApiError",
      status: 500,
    });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("wraps non-success API responses in a WeatherApiError", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 503,
    });

    await expect(getWeatherDetails("recife")).rejects.toMatchObject({
      name: "WeatherApiError",
      status: 503,
    });
  });
});

describe("city weather loader", () => {
  it("delegates 404 city errors to Next notFound", async () => {
    await expect(loadCityWeather("missing")).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it("rethrows non-404 weather errors", async () => {
    delete process.env.WEATHER_API_KEY;

    await expect(loadCityWeather("recife")).rejects.toBeInstanceOf(WeatherApiError);
    expect(notFound).not.toHaveBeenCalled();
  });
});
