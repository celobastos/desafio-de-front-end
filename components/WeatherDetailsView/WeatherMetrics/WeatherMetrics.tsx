import styles from "./WeatherMetrics.module.css";

type WeatherMetric = {
  label: string;
  value: string;
};

type WeatherMetricsProps = {
  metrics: WeatherMetric[];
};

export function WeatherMetrics({ metrics }: WeatherMetricsProps) {
  return (
    <section className={styles.weatherMetrics} aria-label="Weather metrics">
      {metrics.map((metric) => (
        <article className={styles.metricItem} key={metric.label}>
          <span>{metric.label}</span>
          <span>{metric.value}</span>
        </article>
      ))}
    </section>
  );
}
