import {renderForecastItem} from "../components/ForecastItem.js";
import { WEATHER_CODES} from "../utils/constants.js";
import MeteoService from "../services/meteoService.js";
import { LoadingView} from "../components/Loading.js";
import JsonService from "../services/jsonService.js";
import {getWeatherIcon, getWeatherIconColor, getMetricIcon} from "../utils/helpers.js";
import jsonService from "../services/jsonService.js";
import {formatDate} from "../utils/helpers.js";

async function getData(id) {
    try{
        const project = await jsonService.getProjectById(id);
        const weather = await MeteoService.getDetailWeather(project.lat, project.lon);


        const response = {ciudad: project.city,
            coords: {lat: project.lat, lon: project.lon},
            status: project.status,
            description: project.description,
            current: {
                temperature: weather.current.temperature,
                apparentTemperature: weather.hourly.apparentTemperature},
            code: weather.current.weatherCode,
            wind: {
                speed: weather.current.windSpeed,
                direction: weather.current.windDirection
            },
            precipitation: weather.hourly.precipitation,
            humidity: weather.hourly.humidity,
            visibility: weather.hourly.visibility,
            sunrise: weather.sun.sunrise,
            sunset: weather.sun.sunset,
            lastUpdate: formatDate(Date.now()),
            currentTime:formatDate(weather.current.time),
            forecast: weather.forecast,

        };

        return response;


    } catch (error) {
        console.log(error);
    }
}
export function renderDetailView(id) {
    const data = getData(id);




    const main = document.createElement('main');
    main.innerHTML = LoadingView();

    getData(id).then((data) => {
        if (!data) {
            main.innerHTML = `<div class="container"><p class="error">No se pudieron cargar los detalles.</p></div>`;
            return;
        }
        const forecastData = data.forecast;
        const forecastHTML = forecastData.map(fore => renderForecastItem(fore)).join('');
        console.log(forecastHTML);
        main.innerHTML = `<div class="detail-container">
            <div class="container">
                <!-- Back Button -->
                <a href="#" class="back-button">
                    <svg class="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Volver al listado
                </a>

                <!-- Detail Header -->
                <div class="detail-header">
                    <div class="detail-header-top">
                        <div class="detail-title-wrapper">
                            <svg class="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <div>
                                <h1 class="detail-title">${data.ciudad}</h1>
                                <p class="detail-coords">Lat: ${data.coords.lat} / Lon: ${data.coords.lon}</p>
                            </div>
                        </div>
                        <span class="badge active" style="font-size: 1rem; padding: 0.5rem 1rem;">${data.status}</span>
                    </div>
                    <p class="detail-description">${data.description}</p>
                </div>

                <!-- Main Content Grid -->
                <div class="detail-content">
                    <!-- Current Weather (Main Panel) -->
                    <div>
                        <div class="current-weather">
                            <h2 class="section-title">Condiciones Actuales</h2>

                            <div class="temp-display">
                                <div>
                                    <div class="temp-main">
                                        <span class="temp-number">${data.current.temperature}</span>
                                        <span class="temp-unit">C°</span>
                                    </div>
                                    <p class="temp-feels">Sensación térmica: ${data.current.apparentTemperature} C°</p>
                                </div>
                                <svg class="temp-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: ${getWeatherIconColor(data.code)};">
                                    ${getWeatherIcon(data.code)}
                                </svg>
                                
                            </div>

                            <!-- Metrics Grid -->
                            <div class="metrics-grid">
                                <div class="metric-card blue">
                                    <svg class="metric-icon blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                    </svg>
                                    <p class="metric-label">Viento</p>
                                    <p class="metric-value">${data.wind.speed} Km/h</p>
                                    <p class="metric-extra">${data.wind.direction}</p>
                                </div>

                                <div class="metric-card sky">
                                    <svg class="metric-icon sky" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                                    </svg>
                                    <p class="metric-label">Precipitación</p>
                                    <p class="metric-value">${data.precipitation} mm/h</p>
                                </div>

                                <div class="metric-card teal">
                                    <svg class="metric-icon teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                    </svg>
                                    <p class="metric-label">Humedad</p>
                                    <p class="metric-value">${data.humidity}%</p>
                                </div>

                                <div class="metric-card purple">
                                    <svg class="metric-icon purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                    <p class="metric-label">Visibilidad</p>
                                    <p class="metric-value">${data.visibility}%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Sidebar -->
                    <div>
                        <!-- Sun Info -->
                        <div class="sidebar-section">
                            <h3 class="section-title" style="font-size: 1.125rem; margin-bottom: 1rem;">Sol</h3>
                            <div class="sun-info">
                                <div class="sun-item">
                                    <div class="sun-label">
                                        <svg class="sun-icon sunrise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                                        </svg>
                                        <span>Amanecer</span>
                                    </div>
                                    <span class="sun-time">${data.sunrise}</span>
                                </div>
                                <div class="sun-item">
                                    <div class="sun-label">
                                        <svg class="sun-icon sunset" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                        </svg>
                                        <span>Atardecer</span>
                                    </div>
                                    <span class="sun-time">${data.sunset}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Last Update -->
                        <div class="update-info">
                            <div class="update-content">
                                <svg class="update-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <div>
                                    <p class="update-label">Última actualización</p>
                                    <p class="update-date">${data.lastUpdate}</p>
                                    <p class="update-label">Hora en ${data.ciudad}: </p>
                                    <p class="update-date">${data.currentTime}</p>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Forecast Section (Modularized) -->
                <div class="forecast-section">
                    <h2 class="section-title">Pronóstico por Hora</h2>
                    <div class="forecast-grid">
                        ${forecastHTML}
                    </div>
                </div>

                <!-- About Section -->
                <div class="about-section">
                    <h2 class="section-title">Acerca del Proyecto</h2>
                    <p class="about-text">
                        Este proyecto forma parte de la red nacional de observatorios urbanos y tiene como objetivo principal proporcionar información climática y ambiental en tiempo real a ciudadanos, tomadores de decisiones y medios de comunicación.
                    </p>
                    <p class="about-text">
                        El sistema cuenta con múltiples estaciones meteorológicas distribuidas estratégicamente en la zona metropolitana, que recopilan datos cada 10 minutos sobre temperatura, humedad, velocidad del viento, precipitación y calidad del aire.
                    </p>
                </div>
            </div>
        </div>`;
    });
    return main;
}
