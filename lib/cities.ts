export type City = {
  id: string;
  label: string;
  countryCode: string;
  latitude: number;
  longitude: number;
};

export const cities = [
  {
    id: "dallol",
    label: "Dallol",
    countryCode: "NG",
    latitude: 12.083333,
    longitude: 3.533333,
  },
  {
    id: "fairbanks",
    label: "Fairbanks",
    countryCode: "US",
    latitude: 64.83778,
    longitude: -147.71639,
  },
  {
    id: "londres",
    label: "Londres",
    countryCode: "GB",
    latitude: 51.50735,
    longitude: -0.12776,
  },
  {
    id: "recife",
    label: "Recife",
    countryCode: "BR",
    latitude: -8.04756,
    longitude: -34.877,
  },
  {
    id: "vancouver",
    label: "Vancouver",
    countryCode: "CA",
    latitude: 49.28273,
    longitude: -123.12074,
  },
  {
    id: "yakutsk",
    label: "Yakutsk",
    countryCode: "RU",
    latitude: 62.03545,
    longitude: 129.67547,
  },
] as const satisfies readonly City[];

export type CityId = (typeof cities)[number]["id"];

export function getCityById(cityId: string): City | undefined {
  return cities.find((city) => city.id === cityId);
}
