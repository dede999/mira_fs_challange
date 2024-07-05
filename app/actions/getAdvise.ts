"use server";

import axios from "axios";

type ActionParams = {
  country: string;
  state: string;
  city: string;
  temperature: number[];
  humidity: number[];
  rain: boolean;
  windSpeed: number;
};

export async function getAdvise({
  country,
  state,
  city,
  temperature,
  humidity,
  rain,
  windSpeed,
}: ActionParams) {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat`,
    {
      location: { country, state, city },
      weather: {
        minTemp: temperature[0],
        maxTemp: temperature[1],
        minHumidity: humidity[0],
        maxHumidity: humidity[1],
        rain,
        windSpeed,
      },
    },
  );
  return response.data.finalContent;
}
