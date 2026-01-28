import {API_URLS, WEATHER_CODES} from "../utils/constants.js";

class MeteoService {

    async getWeather(latitude, longitude) {
        try {
            const URL = `${API_URLS.WEATHER}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,windspeed_10m,winddirection_10m&timezone=America/Bogota`;

            const response = await fetch(URL);
            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status}`);
            }

            const data = await response.json();

            const date = new Date(data.current.time);
            const formattedDate = date.toLocaleString('es-CO', {
                weekday: 'long',
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            });

            return {
                temperature: Math.round(data.current.temperature_2m),
                windSpeed: Math.round(data.current.windspeed_10m),
                windDirection: data.current.winddirection_10m,
                rain: data.current.precipitation || 0,
                time: formattedDate,
                elevation: data.elevation
            };
        } catch (error) {
            console.error('Clima no obtenido', error);
            throw new Error('No se pudo conectar con la API de Open-Meteo.');
        }
    }



    async getDetailWeather(latitude, longitude) {
        try {
            const URL = `${API_URLS.WEATHER}?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,precipitation,windspeed_10m,visibility,weathercode&daily=sunrise,sunset&timezone=auto&forecast_days=2`;
            const response = await fetch(URL);


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
                humidity: hourlyData.relativehumidity_2m[currentHour],
                precipitation: hourlyData.precipitation[currentHour],
                visibility: hourlyData.visibility[currentHour] / 1000, //Convertir a km
                apparentTemperature: Math.round(hourlyData.temperature_2m[currentHour]),
            };

            // Lógica corregida para el Forecast (Próximas 6 horas con transición de día)
            const forecast = [];
            const hoursToForecast = 6;

            for (let i = 0; i < hoursToForecast; i++) {
                // El índice en el array de datos (lineal).
                // Al ser > 23, accede automáticamente a los datos del día siguiente en el array.
                const dataIndex = currentHour + i;

                // Calculamos la hora de visualización (0-23) usando módulo
                // Ejemplo: si dataIndex es 25, 25 % 24 = 1 (La 01:00 AM)
                const displayHour = dataIndex % 24;

                // Formateamos "1" a "01:00"
                const timeLabel = `${displayHour.toString().padStart(2, '0')}:00`;

                // Verificamos que existan datos (por seguridad)
                if (hourlyData.temperature_2m[dataIndex] !== undefined) {
                    forecast.push({
                        time: timeLabel,
                        temperature: Math.round(hourlyData.temperature_2m[dataIndex]) + '°',
                        weatherCode: hourlyData.weathercode[dataIndex],
                        condition: WEATHER_CODES[hourlyData.weathercode[dataIndex]] || 'Desconocido'
                    });
                }
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
export default new MeteoService();