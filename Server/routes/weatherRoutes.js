/** 
  Author: Piera Blum
  Date: 26.06.2024
  Description: This is the Backend for the Weather Page.
*/

const express = require("express");
const router = express.Router();
const API_KEY = "d711bf40131378bbd7884b9af3243f4a";
const cityName = "Zurich";

//gets the weather data
router.get("/weather", async (req, res) => {
  try {
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
    );
    if (!weatherResponse.ok) {
      const errorText = await weatherResponse.text();
      console.error(
        `Failed to fetch weather data: ${weatherResponse.status} ${weatherResponse.statusText} - ${errorText}`
      );
      res
        .status(weatherResponse.status)
        .json({ error: weatherResponse.statusText, details: errorText });
      return;
    }
    const weatherData = await weatherResponse.json();

    const { coord } = weatherData;
    console.log("Coordinates:", coord);

    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&units=metric&appid=${API_KEY}`
    );
    if (!forecastResponse.ok) {
      const errorText = await forecastResponse.text();
      console.error(
        `Failed to fetch forecast data: ${forecastResponse.status} ${forecastResponse.statusText} - ${errorText}`
      );
      res
        .status(forecastResponse.status)
        .json({ error: forecastResponse.statusText, details: errorText });
      return;
    }
    const forecastData = await forecastResponse.json();

    const dailyData = [];
    const seenDates = new Set();
    forecastData.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!seenDates.has(date)) {
        seenDates.add(date);
        dailyData.push({
          date: date,
          temperature: item.main.temp,
          rainProbability: item.pop || 0,
          cloudiness: item.clouds.all,
        });
      }
    });

    res.status(200).json({
      cityName: weatherData.name,
      daily: dailyData.slice(0, 7),
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

module.exports = router;
