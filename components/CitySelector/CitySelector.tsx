import Link from "next/link";
import { WeatherAssetIcon } from "@/components/WeatherAssetIcon";
import { cities } from "@/lib/cities";
import styles from "./CitySelector.module.css";

export function CitySelector() {
  return (
    <main className={styles.screen}>
      <section className={styles.picker} aria-labelledby="weather-title">
        <header className={styles.header}>
          <h1 id="weather-title">Weather</h1>
          <p>Select a city</p>
        </header>

        <WeatherAssetIcon name="globe" className={styles.globeIcon} alt="Globe icon" />

        <nav className={styles.cityGrid} aria-label="Cities">
          {cities.map((city) => (
            <Link className={styles.cityLink} href={`/city/${city.id}`} key={city.id}>
              {city.label}
            </Link>
          ))}
        </nav>
      </section>
    </main>
  );
}
