import { render, screen } from "@testing-library/react";
import { WeatherDetailsView } from "@/components/WeatherDetailsView";
import { cities } from "@/lib/cities";
import type { WeatherDetails } from "@/lib/weather";

const weather: WeatherDetails = {
  city: cities[3],
  locationName: "Recife",
  country: "Brazil",
  localTime: "2026-05-25 13:00",
  lastUpdated: "2026-05-25 12:45",
  currentTemperatureC: 28.6,
  currentWeather: "Partly cloudy",
  mood: "bad",
  windSpeedKph: 17.2,
  humidity: 76,
  sunrise: "05:22 AM",
  sunset: "05:07 PM",
  maxTemperatureC: 31.2,
  minTemperatureC: 24.1,
  periods: [
    { label: "Dawn", time: "03:00", temperatureC: 24.2, condition: "Partly cloudy" },
    { label: "Morning", time: "09:00", temperatureC: 26.3, condition: "Sunny" },
    { label: "Afternoon", time: "15:00", temperatureC: 29.5, condition: "Partly cloudy" },
    { label: "Night", time: "21:00", temperatureC: 25.1, condition: "Clear" },
  ],
};

describe("WeatherDetailsView", () => {
  it("renders the success weather state", () => {
    render(<WeatherDetailsView weather={weather} />);

    expect(screen.getByRole("heading", { name: "Recife" })).toBeInTheDocument();
    expect(screen.getByText("Partly cloudy")).toBeInTheDocument();
    expect(screen.getByText("29")).toBeInTheDocument();
    expect(screen.getByText("Wind speed")).toBeInTheDocument();
    expect(screen.getByText("Sunrise")).toBeInTheDocument();
    expect(screen.getByText("Sunset")).toBeInTheDocument();
    expect(screen.getByText("Humidity")).toBeInTheDocument();
    expect(screen.getByText("Dawn")).toBeInTheDocument();
    expect(screen.getByText("Morning")).toBeInTheDocument();
    expect(screen.getByText("Afternoon")).toBeInTheDocument();
    expect(screen.getByText("Night")).toBeInTheDocument();
  });
});