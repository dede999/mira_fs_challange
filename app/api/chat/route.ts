import { NextResponse } from "next/server";
import { client } from "@/lib/openai";
import axios from "axios";
import { LocationParams, WeatherParams } from "@/lib/types";
import { getCityName } from "@/lib/api/chatMessages";

type QueryParams = {
  location: LocationParams;
  weather: WeatherParams;
};

type Coordinates = {
  latitude: number;
  longitude: number;
};

type WeatherInfo = {
  temperature: number;
  humidity: number;
  rain: number;
  windSpeed: number;
};

function appendUrlParams(baseUrl: string, query: any) {
  const url = new URL(baseUrl);
  Object.keys(query).forEach((key) => url.searchParams.append(key, query[key]));
  url.searchParams.append("appid", process.env.OPENWEATHER_API_KEY as string);
  return url.toString().replaceAll("%2C", ",");
}

async function getCoordinates(args: LocationParams): Promise<Coordinates> {
  const url = appendUrlParams("http://api.openweathermap.org/geo/1.0/direct", {
    q: `${args.city}\,${args.state}\,${args.country}`,
    limit: 1,
  });
  try {
    const { data } = await axios.get(url);
    return { latitude: data[0].lat, longitude: data[0].lon };
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getWeather(args: Coordinates): Promise<WeatherInfo> {
  const url = appendUrlParams(
    "https://api.openweathermap.org/data/2.5/weather",
    {
      lat: args.latitude,
      lon: args.longitude,
      units: "metric",
    },
  );
  console.log({ url, args });
  try {
    const { data } = await axios.get(url);
    console.log({ weatherData: data });
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

export async function POST(request: Request) {
  const body = (await request.json()) as QueryParams;
  const getCoordinatesProc = async () => getCoordinates(body.location);
  const cityName = getCityName(body.location);

  const runner = client.beta.chat.completions.runTools({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `The user wants to know if he/she can go outside in ${cityName} today. `,
      },
      {
        role: "user",
        content:
          "Conditions: Temperature sensation below 25 Celcius, humidity below 80%," +
          "wind speed: below 5MPH and no rain",
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          function: getCoordinatesProc,
          parameters: {
            type: "object",
            properties: {
              country: { type: "string" },
              state: { type: "string" },
              city: { type: "string" },
            },
          },
        },
      },
      {
        type: "function",
        function: {
          function: getWeather,
          parse: JSON.parse,
          type: "object",
          parameters: {
            type: "object",
            properties: {
              latitude: { type: "number" },
              longitude: { type: "number" },
            },
          },
        },
      },
    ],
  });
  const finalContent = await runner.finalContent();

  return NextResponse.json({
    message: "Hello from the chat endpoint",
    finalContent,
  });
}
