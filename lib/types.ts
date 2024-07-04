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

export type QueryParams = {
  location: LocationParams;
  weather: Partial<WeatherParams>;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type WeatherInfo = {
  temperature: number;
  humidity: number;
  rain: number;
  windSpeed: number;
};

export type ErrorMessage = {
  message: string;
  error: unknown;
};
