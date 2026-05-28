import type { StaticImageData } from "next/image";
import globe from "@/assets/la_globe-americas.svg";
import arrowDown from "@/assets/stash_arrow-down-light.svg";
import arrowUp from "@/assets/stash_arrow-up-light.svg";
import sun from "@/assets/BsSun.svg";
import moon from "@/assets/BsMoon.svg";
import cloudy from "@/assets/BsCloudy.svg";
import cloud from "@/assets/BsCloudFill.svg";
import cloudSun from "@/assets/BsCloudSun.svg";
import cloudMoon from "@/assets/BsCloudMoon.svg";
import drizzle from "@/assets/BsCloudDrizzle.svg";
import rain from "@/assets/BsCloudRain.svg";
import heavyRain from "@/assets/BsCloudRainHeavy.svg";
import snow from "@/assets/BsCloudSnow.svg";
import sleet from "@/assets/BsCloudSleet.svg";
import hail from "@/assets/BsCloudHail.svg";
import fog from "@/assets/BsCloudFog.svg";
import haze from "@/assets/BsCloudHaze.svg";
import lightning from "@/assets/BsCloudLightning.svg";
import lightningRain from "@/assets/BsCloudLightningRain.svg";
import styles from "./WeatherAssetIcon.module.css";

export type WeatherAssetName =
  | "globe"
  | "arrow-up"
  | "arrow-down"
  | "sun"
  | "moon"
  | "cloud"
  | "cloudy"
  | "cloud-sun"
  | "cloud-moon"
  | "drizzle"
  | "rain"
  | "heavy-rain"
  | "snow"
  | "sleet"
  | "hail"
  | "fog"
  | "haze"
  | "lightning"
  | "lightning-rain";

const assets: Record<WeatherAssetName, StaticImageData> = {
  globe,
  "arrow-up": arrowUp,
  "arrow-down": arrowDown,
  sun,
  moon,
  cloud,
  cloudy,
  "cloud-sun": cloudSun,
  "cloud-moon": cloudMoon,
  drizzle,
  rain,
  "heavy-rain": heavyRain,
  snow,
  sleet,
  hail,
  fog,
  haze,
  lightning,
  "lightning-rain": lightningRain,
};

type WeatherAssetIconProps = {
  name: WeatherAssetName;
  alt?: string;
  className?: string;
};

export function WeatherAssetIcon({ name, alt = "", className = "" }: WeatherAssetIconProps) {
  const asset = assets[name];
  const classes = className ? `${styles.assetIcon} ${className}` : styles.assetIcon;

  return <img className={classes} src={asset.src} alt={alt} aria-hidden={alt ? undefined : true} />;
}
