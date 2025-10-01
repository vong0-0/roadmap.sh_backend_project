import express from "express";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import axios from "axios";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

const cache = {};

const CACHE_DURATION = process.env.CACHE_DURATION
  ? parseInt(process.env.CACHE_DURATION)
  : 43200;

function setCache(key, data) {
  cache[key] = {
    data,
    exiry: Date.now() + CACHE_DURATION * 1000,
  };
}

function getCache(key) {
  const cached = cache[key];
  if (!cached) return null;
  if (cached.expiry < Date.now()) {
    delete cached[key];
    return null;
  }

  return cached.data;
}

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
});

app.use(limiter);

app.get("/weather/:city", async (req, res) => {
  const city = req.params.city.toLocaleLowerCase();
  const cacheKey = `weather:${city}`;

  const cacheData = getCache(cacheKey);
  if (cacheData) {
    return res.status(200).json({
      source: "cache",
      data: cacheData,
    });
  }

  try {
    const apiKey = process.env.VISUAL_CROSSING_API_KEY;
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${apiKey}&unitGroup=metric&contentType=json`;
    const response = await axios.get(url);

    const weatherData = response.data;

    setCache(cacheKey, weatherData);

    res.status(200).json({
      source: "API",
      data: weatherData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
