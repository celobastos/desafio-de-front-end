export class WeatherApiError extends Error {
  readonly status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "WeatherApiError";
    this.status = status;
  }
}
