import { LocationParams, OpenAiMessages, WeatherParams } from "../types";

export function getCityName(location: LocationParams): string {
  const info = Object.values(location).filter((value) => value !== undefined);
  return info.join(", ");
}

export function useDefaultWeatherParams(
  params: Partial<WeatherParams>,
): WeatherParams {
  return {
    maxTemp: params.maxTemp ?? 25,
    minTemp: params.minTemp ?? 0,
    maxHumidity: params.maxHumidity ?? 80,
    minHumidity: params.minHumidity ?? 0,
    rain: params.rain || false,
    windSpeed: params.windSpeed ?? 5,
  };
}

export function getWeatherConditions(weather: WeatherParams): OpenAiMessages {
  const values = [
    `Temperature: more than ${weather.minTemp} and less then ${weather.maxTemp} Celcius`,
    `Humidity: between ${weather.minHumidity}% and ${weather.maxHumidity}%`,
    `It ${weather.rain ? "must" : "must not"} be raining`,
    `Wind speed must not exceed ${weather.windSpeed} MPH`,
  ];
  return {
    role: "user",
    content: values.join("\n"),
  };
}
