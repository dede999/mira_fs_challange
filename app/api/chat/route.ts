import { NextResponse } from "next/server";
import { client } from "@/lib/openai";
import axios from "axios";

type QueryParams = {
  country: string;
  state: string;
  city: string;
};

type Coordinates = {
  latitude: number;
  longitude: number;
};

async function getCoordinates(args: QueryParams) {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${args.city},${args.state},${args.country}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`;
  await axios
    .get(url)
    .then(({ data }) => {
      console.log({
        coordData: { latitude: data[0].lat, longitude: data[0].lon },
      });
      return { latitude: data[0].lat, longitude: data[0].lon };
    })
    .catch((err) => console.error(err));
}

async function getWeather(args: Coordinates) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${args.latitude}&lon=${args.longitude}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
  console.log({ url, args });
  await axios
    .get(url)
    .then(({ data }) => {
      console.log({ weatherData: data });
      return {
        temperature: data.main.feels_like,
        humidity: data.main.humidity,
        rain: data.rain ? data.rain["1h"] : 0,
        windSpeed: data.wind.speed,
      };
    })
    .catch((err) => console.error(err));
}

export async function POST(request: Request) {
  const body = (await request.json()) as QueryParams;
  const getCoordinatesProc = async () => getCoordinates(body);

  const runner = client.beta.chat.completions.runTools({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content:
          `The user is from ${body.city}, ${body.state}, ${body.country}.` +
          "The user wants to know if he/she can go outside.",
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
