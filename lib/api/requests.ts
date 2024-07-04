import axios from "axios";
import { Coordinates, LocationParams, WeatherInfo } from "../types";

export function appendUrlParams(baseUrl: string, query: any) {
  const url = new URL(baseUrl);
  Object.keys(query).forEach((key) => url.searchParams.append(key, query[key]));
  url.searchParams.append("appid", process.env.OPENWEATHER_API_KEY as string);
  return url.toString().replaceAll("%2C", ",");
}

export async function getCoordinates(
  args: LocationParams,
): Promise<Coordinates> {
  const url = appendUrlParams("http://api.openweathermap.org/geo/1.0/direct", {
    q: `${args.city}\,${args.state}\,${args.country}`,
    limit: 1,
  });
  try {
    const { data } = await axios.get(url);
    return { latitude: data[0].lat, longitude: data[0].lon };
  } catch (err) {
    throw err;
  }
}

export async function getWeather(args: Coordinates): Promise<WeatherInfo> {
  const url = appendUrlParams(
    "https://api.openweathermap.org/data/2.5/weather",
    {
      lat: args.latitude,
      lon: args.longitude,
      units: "metric",
    },
  );
  try {
    const { data } = await axios.get(url);
    return {
      temperature: data.main.feels_like,
      humidity: data.main.humidity,
      rain: data.rain ? data.rain["1h"] : 0,
      windSpeed: data.wind.speed,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
}
