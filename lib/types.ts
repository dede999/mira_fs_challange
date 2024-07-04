export type LocationParams = {
  country?: string;
  state: string;
  city: string;
};

export type WeatherParams = {
  maxTemp: number;
  minTemp: number;
  maxHumidity: number;
  minHumidity: number;
  rain: boolean;
  windSpeed: number;
};

export type OpenAiMessages = {
  role: "user";
  content: string;
  name?: string;
  tool_calls?: any;
};
