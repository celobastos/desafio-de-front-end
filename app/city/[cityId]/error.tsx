"use client";

import Link from "next/link";
import { StatusActionButton, StatusShell } from "@/components/StatusShell";
import styles from "@/components/StatusShell/StatusShell.module.css";

type CityWeatherErrorProps = {
  reset: () => void;
};

export default function CityWeatherError({ reset }: CityWeatherErrorProps) {
  return (
    <StatusShell
      title="Weather unavailable"
      message="We could not load the latest forecast for this city."
      details={[
        "This can happen when the weather service is temporarily unavailable, the API key is missing, or the network request times out.",
        "Try again in a moment, or go back and choose another city.",
      ]}
      action={
        <div className={styles.actions}>
          <StatusActionButton onClick={reset}>Try again</StatusActionButton>
          <Link className={styles.backLink} href="/">
            Select a city
          </Link>
        </div>
      }
    />
  );
}
