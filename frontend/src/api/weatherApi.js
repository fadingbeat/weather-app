import api from './axiosInstance';

export const getCurrentWeather = (lat, lon) =>
  api.get(`/api/weather/current?lat=${lat}&lon=${lon}`);

export const getForecast = (city) =>
  api.get(`/api/weather/forecast?city=${city}`);

export const searchCities = (query) =>
  api.get(`/api/weather/cities?query=${query}`);
