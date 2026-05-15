export interface WeatherSlice {
  time: string;
  temperature: number;
  windSpeed: number;
  windGust?: number;
  windFromDirection?: number;
  precipitation: number;
  symbolCode: string;
}

export interface WeatherSummary {
  now: WeatherSlice;
  tempMin: number;
  tempMax: number;
  precipTotal: number;
  windMax: number;
}

export interface MetTimeseriesEntry {
  time: string;
  data: {
    instant: {
      details: {
        air_temperature?: number;
        wind_speed?: number;
        wind_speed_of_gust?: number;
        wind_from_direction?: number;
      };
    };
    next_1_hours?: {
      summary: { symbol_code: string };
      details: { precipitation_amount?: number };
    };
    next_6_hours?: {
      summary: { symbol_code: string };
      details: { precipitation_amount?: number };
    };
    next_12_hours?: {
      summary: { symbol_code: string };
      details?: { precipitation_amount?: number };
    };
  };
}

export interface MetForecast {
  properties: {
    meta: { updated_at: string };
    timeseries: MetTimeseriesEntry[];
  };
}
