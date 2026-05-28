import { WeatherAssetIcon } from "@/components/WeatherAssetIcon";
import { formatTemperature } from "@/lib/weather/formatters";
import { getPeriodAsset } from "@/lib/weather/icon-mapping";
import type { WeatherDetails } from "@/lib/weather";
import styles from "./PeriodForecastGrid.module.css";

type PeriodForecastGridProps = {
  periods: WeatherDetails["periods"];
};

export function PeriodForecastGrid({ periods }: PeriodForecastGridProps) {
  return (
    <section className={styles.periodGrid} aria-label="Period temperatures">
      {periods.map((period) => (
        <article className={styles.periodItem} key={period.label}>
          <span>{period.label}</span>
          <WeatherAssetIcon
            name={getPeriodAsset(period)}
            className={styles.weatherGlyph}
            alt={`${period.condition} icon`}
          />
          <strong>{formatTemperature(period.temperatureC)}</strong>
        </article>
      ))}
    </section>
  );
}
