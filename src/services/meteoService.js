import {API_URLS, WEATHER_CODES} from "../utils/constants.js";

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

    async getDetailWeather(latitude, longitude) {
        try {
            const URL = `${API_URLS.WEATHER}?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,precipitation,windspeed_10m,visibility,weathercode&daily=sunrise,sunset&timezone=auto&forecast_days=1`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status}`);
            }

            const data = await response.json();

            //Datos actuales
            const current = {
                temperature: Math.round(data.current_weather.temperature),
                windSpeed: Math.round(data.current_weather.windspeed),
                windDirection: this.getWindDirection(data.current_weather.winddirection),
                weatherCode: data.current_weather.weathercode,
                time: data.current_weather.time
            };

            //Índice Hora Actual
            // En lugar de new Date().getHours()
            const remoteTimeStr = data.current_weather.time; // La API nos da la hora local actual de la ciudad
            const remoteDate = new Date(remoteTimeStr);
            const currentHour = remoteDate.getHours();
            const hourlyData = data.hourly;

            //Datos horarios actuales
            const hourly = {
                humidity: hourlyData.relativehumidity_2m[remoteDate],
                precipitation: hourlyData.precipitation[remoteDate],
                visibility: hourlyData.visibility[remoteDate] / 1000, //Convertir a km
                apparentTemperature: Math.round(hourlyData.temperature_2m[remoteDate])
            };

            const forecast = [];
            for (let i = remoteDate; i < 6 && i < 24; i++) {
                forecast.push({
                    time: `${i}:00`,
                    temperature: Math.round(hourlyData.temperature_2m[i]),
                    weatherCode: hourlyData.weathercode[i],
                    condition: WEATHER_CODES[hourlyData.weathercode[i]] || 'Desconocido'

                });
            }
            //sol y puesta
            const sun = {
                sunrise: data.daily.sunrise[0].split('T')[1],
                sunset: data.daily.sunset[0].split('T')[1]
            };
            return {
                current,
                hourly,
                forecast,
                sun
            };
        } catch (error) {
            console.error('Error obteniendo clima detallado:', error);
            throw new Error('No se pudo obtener el pronóstico del clima');
        }
    }
        getWindDirection(degrees) {
            const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
            const index = Math.round(degrees / 45) % 8;
            return directions[index];
        }


        getWeatherDescription(code) {
            return WEATHER_CODES[code] || 'Desconocido';
        }




}
// Exportar instancia única (Singleton)
export default new WeatherService();