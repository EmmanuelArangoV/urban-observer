import {API_URLS} from "../utils/constants.js";

class MeteoService {

    async getWeather(latitude, longitude) {
        try {
            const URL = `${API_URLS.WEATHER}?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`

            const response = await fetch(URL);

            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status}`);
            }

            const data = await response.json();

            return {
                temperature: Math.round(data.current_weather.temperature),
                windSpeed: Math.round(data.current_weather.windspeed),
                windDirection: data.current_weather.winddirection,
                weatherCode: data.current_weather.weathercode,
                time: data.current_weather.time
            };
        } catch (error) {
            console.error('Clima no obtenido', error);
            throw new Error('No se pudo conectar con la API de Open-Meteo.');
        }
    }
}