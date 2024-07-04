import { LocationParams, WeatherParams } from "../types";

export function getCityName(location: LocationParams): string {
  const info = Object.values(location).filter((value) => value !== undefined);
  return info.join(", ");
}
