"use client";
import React, { useState } from "react";
import { TextField, Grid, Card, CardContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const API_KEY = "66a0e67532aa43c8bd6222252250403"; // Reemplázalo con tu clave de WeatherAPI

interface WeatherInfo {
  location?: { name: string; country: string };
  current?: { temp_c: number; condition: { text: string } };
}

const WeatherSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [weatherData, setWeatherData] = useState<Record<string, WeatherInfo>>(
    {}
  );
  const [selectedCities, setSelectedCities] = useState<string[]>([]);

  const fetchWeather = async (city: string) => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`
      );
      const result = await response.json();
      if (result.location) {
        setWeatherData((prev) => ({ ...prev, [city]: result }));
        setSelectedCities((prev) => [...new Set([...prev, city])]);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const removeCity = (city: string) => {
    setSelectedCities((prev) => prev.filter((c) => c !== city));
    setWeatherData((prev) => {
      const newData = { ...prev };
      delete newData[city];
      return newData;
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <TextField
        label="Buscar ciudad"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && searchTerm.trim()) {
            fetchWeather(searchTerm.trim());
            setSearchTerm("");
          }
        }}
      />

      <Grid
        container
        spacing={2}
        justifyContent="center"
        style={{ marginTop: "20px" }}
      >
        {selectedCities.map((city) => (
          <Grid item key={city} xs={12} sm={6} md={4} lg={3}>
            <Card className="p-4 shadow-lg relative">
              <IconButton
                style={{ position: "absolute", top: 5, right: 5 }}
                onClick={() => removeCity(city)}
              >
                <CloseIcon />
              </IconButton>
              <CardContent>
                <h2 className="text-xl font-bold">
                  {weatherData[city]?.location?.name}
                </h2>
                {weatherData[city] && weatherData[city].current ? (
                  <>
                    <p>Temperatura: {weatherData[city].current.temp_c}°C</p>
                    <p>Clima: {weatherData[city].current.condition.text}</p>
                  </>
                ) : (
                  <p>Cargando o datos no disponibles</p>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default WeatherSearch;
