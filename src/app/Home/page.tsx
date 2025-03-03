"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@mui/material";
import { Grid } from "@mui/material";
import Menu from "../components/menu";
const cities = [
  "Mexico City",
  "Guadalajara",
  "Monterrey",
  "Cancun",
  "Tijuana",
  "Aguascalientes",
  "Queretaro",
];
const API_KEY = "6c07aaad6ea7bd289b984d815797bca2";

interface WeatherInfo {
  main?: { temp: number };
  weather?: { description: string }[];
}

const WeatherGrid = () => {
  const [weatherData, setWeatherData] = useState<Record<string, WeatherInfo>>(
    {}
  );

  useEffect(() => {
    const fetchWeather = async () => {
      const data: Record<string, WeatherInfo> = {};
      for (const city of cities) {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city},MX&appid=${API_KEY}&units=metric`
          );
          const result = await response.json();
          data[city] = result;
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      }
      setWeatherData(data);
    };

    fetchWeather();
  }, []);

  return (
    <>
      <Menu />
      <Grid container spacing={2} justifyContent="center">
        {cities.map((city) => (
          <Grid item key={city} xs={12} sm={6} md={4} lg={3}>
            <Card className="p-4 shadow-lg">
              <CardContent>
                <h2 className="text-xl font-bold">{city}</h2>
                {weatherData[city] && weatherData[city].main ? (
                  <>
                    <p>Temperatura: {weatherData[city].main?.temp}°C</p>
                    <p>Clima: {weatherData[city].weather?.[0]?.description}</p>
                  </>
                ) : (
                  <p>Cargando o datos no disponibles</p>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default WeatherGrid;
