import { WeatherAssetIcon } from "@/components/WeatherAssetIcon";
import { formatSignedTemperature } from "@/lib/weather/formatters";
import styles from "./CurrentForecast.module.css";

type CurrentForecastProps = {
  currentTemperatureC: number;
  maxTemperatureC: number;
  minTemperatureC: number;
};

export function CurrentForecast({
  currentTemperatureC,
  maxTemperatureC,
  minTemperatureC,
}: CurrentForecastProps) {
  return (
    <section className={styles.currentForecast} aria-label="Current weather">
      <div className={styles.currentTemperature}>
        <strong>{Math.round(currentTemperatureC)}</strong>
        <div className={styles.temperatureDetails}>
          <span className={styles.temperatureUnit}>&deg;C</span>
          <div className={styles.temperatureRange} aria-label="Daily temperature range">
            <span>
              <WeatherAssetIcon name="arrow-up" className={styles.rangeArrow} />
              {formatSignedTemperature(maxTemperatureC)}
            </span>
            <span>
              <WeatherAssetIcon name="arrow-down" className={styles.rangeArrow} />
              {formatSignedTemperature(minTemperatureC)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
