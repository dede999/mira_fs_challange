import {
  getCityName,
  getWeatherConditions,
  useDefaultWeatherParams,
} from "@/lib/api/chatMessages";
import { getCoordinates, getWeather } from "@/lib/api/requests";
import { client } from "@/lib/openai";
import { QueryParams } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as QueryParams;
  const getCoordinatesProc = async () => getCoordinates(body.location);
  const cityName = getCityName(body.location);
  const weatherConditions = getWeatherConditions(
    useDefaultWeatherParams(body.weather ?? {}),
  );

  const runner = client.beta.chat.completions.runTools({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content:
          `The user wants to know if he/she can go outside in ${cityName} today.` +
          "The user will only go out under given conditions. Share your conclusions" +
          " and suggestions based on how much of the criteria is met",
      },
      weatherConditions,
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
