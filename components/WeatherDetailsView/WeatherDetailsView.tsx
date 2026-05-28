import Link from "next/link";
import { WeatherAssetIcon } from "@/components/WeatherAssetIcon";
import type { WeatherDetails } from "@/lib/weather";
import { formatWindSpeedMetersPerSecond } from "@/lib/weather/formatters";
import { getAssetForCondition } from "@/lib/weather/icon-mapping";
import { CurrentForecast } from "./CurrentForecast/CurrentForecast";
import { PeriodForecastGrid } from "./PeriodForecastGrid/PeriodForecastGrid";
import { WeatherMetrics } from "./WeatherMetrics/WeatherMetrics";
import styles from "./WeatherDetailsView.module.css";

export function WeatherDetailsView({ weather }: { weather: WeatherDetails }) {
  const metrics = [
    { label: "Wind speed", value: formatWindSpeedMetersPerSecond(weather.windSpeedKph) },
    { label: "Sunrise", value: weather.sunrise },
    { label: "Sunset", value: weather.sunset },
    { label: "Humidity", value: `${weather.humidity}%` },
  ];

  const screenClassName =
    weather.mood === "good" ? `${styles.screen} ${styles.screenGood}` : styles.screen;

  return (
    <main className={screenClassName}>
      <Link className={styles.backLink} href="/" aria-label="Back to city selection">
        <span aria-hidden="true">←</span>
      </Link>

      <section className={styles.panel} aria-labelledby="city-weather-title">
        <header className={styles.header}>
          <h1 id="city-weather-title">{weather.city.label}</h1>
          <p>{weather.currentWeather}</p>
        </header>

        <CurrentForecast
          currentTemperatureC={weather.currentTemperatureC}
          maxTemperatureC={weather.maxTemperatureC}
          minTemperatureC={weather.minTemperatureC}
        />

        <WeatherAssetIcon
          name={getAssetForCondition(weather.currentWeather)}
          className={styles.mainWeatherGlyph}
          alt={`${weather.currentWeather} icon`}
        />

        <PeriodForecastGrid periods={weather.periods} />

        <WeatherMetrics metrics={metrics} />
      </section>
    </main>
  );
}
