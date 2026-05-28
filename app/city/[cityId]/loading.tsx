import { StatusShell } from "@/components/StatusShell";
import styles from "@/components/StatusShell/StatusShell.module.css";

export default function LoadingCityWeather() {
  return <StatusShell message="Loading weather" visual={<span className={styles.spinner} />} />;
}
