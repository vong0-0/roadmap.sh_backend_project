# 🌦️ Weather API (Node.js + In-memory Cache)

A simple **Weather API** built with **Node.js, Express, Axios, and in-memory caching**.  
It fetches real-time weather data from the [Visual Crossing API](https://www.visualcrossing.com/weather-api), caches the results in memory, and serves them efficiently.

This project demonstrates:

- ✅ Fetching data from a 3rd-party API
- ✅ Implementing in-memory caching with expiration
- ✅ Securing sensitive data with environment variables
- ✅ Preventing abuse using rate limiting
- ✅ Structuring a clean and extensible REST API

---

## 📌 Features

- Fetch weather data by **city name**
- Stores data in **in-memory cache**
- Cache **expires automatically** after a set duration
- **Graceful error handling** for invalid or failed requests
- **Rate limiting** to restrict excessive calls
