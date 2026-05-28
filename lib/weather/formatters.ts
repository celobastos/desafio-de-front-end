export function formatTemperature(value: number): string {
  return `${Math.round(value)}°C`;
}

export function formatSignedTemperature(value: number): string {
  const rounded = Math.round(value);
  return `${rounded > 0 ? "+" : ""}${rounded}°`;
}

export function formatWindSpeedMetersPerSecond(valueInKph: number): string {
  return `${(valueInKph / 3.6).toFixed(2)} m/s`;
}
