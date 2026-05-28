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
const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

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
  consoleErrorSpy.mockClear();
  consoleWarnSpy.mockClear();
  (notFound as jest.Mock).mockClear();
  global.fetch = fetchMock;
});

afterAll(() => {
  process.env.WEATHER_API_KEY = originalWeatherApiKey;
  consoleErrorSpy.mockRestore();
  consoleWarnSpy.mockRestore();
});

function parseLoggedEvent(spy: jest.SpyInstance) {
  return JSON.parse(String(spy.mock.calls[0][0]));
}

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
    expect(parseLoggedEvent(consoleWarnSpy)).toMatchObject({
      level: "warn",
      event: "weather_city_not_found",
      cityId: "missing",
    });
  });

  it("rejects requests when the API key is missing", async () => {
    delete process.env.WEATHER_API_KEY;

    await expect(getWeatherDetails("recife")).rejects.toMatchObject({
      name: "WeatherApiError",
      status: 500,
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(parseLoggedEvent(consoleErrorSpy)).toMatchObject({
      level: "error",
      event: "weather_api_key_missing",
      cityId: "recife",
    });
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

    expect(parseLoggedEvent(consoleErrorSpy)).toMatchObject({
      level: "error",
      event: "weather_api_response_error",
      cityId: "recife",
      provider: "weatherapi",
      status: 503,
    });
  });

  it("logs network request failures", async () => {
    fetchMock.mockRejectedValue(new Error("socket timeout"));

    await expect(getWeatherDetails("recife")).rejects.toThrow("socket timeout");

    expect(parseLoggedEvent(consoleErrorSpy)).toMatchObject({
      level: "error",
      event: "weather_api_request_error",
      cityId: "recife",
      provider: "weatherapi",
      errorName: "Error",
      errorMessage: "socket timeout",
    });
  });

  it("logs invalid provider payloads", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    await expect(getWeatherDetails("recife")).rejects.toBeInstanceOf(WeatherApiError);

    expect(parseLoggedEvent(consoleErrorSpy)).toMatchObject({
      level: "error",
      event: "weather_api_payload_invalid",
      cityId: "recife",
      provider: "weatherapi",
      errorName: "WeatherApiError",
      errorMessage: "Invalid weather API response.",
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
