import { WeatherDetailsView } from "@/components/WeatherDetailsView";
import { loadCityWeather } from "@/lib/weather/load-city-weather";

type CityPageProps = {
  params: Promise<{ cityId: string }>;
};

export default async function CityPage({ params }: CityPageProps) {
  const { cityId } = await params;

  const weather = await loadCityWeather(cityId);
  return <WeatherDetailsView weather={weather} />;
}
