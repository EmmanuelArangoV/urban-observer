import {renderForecastItem} from "../components/forecastItem.js";


export function renderDetailView() {

// 1. Datos para los pronósticos
    const forecastData = [
        {time: "14:00", temp: "23°", condition: "Soleado"},
        {time: "15:00", temp: "24°", condition: "Soleado"},
        {time: "16:00", temp: "23°", condition: "Parcialmente nublado"},
        {time: "17:00", temp: "22°", condition: "Nublado"},
        {time: "18:00", temp: "20°", condition: "Nublado"},
        {time: "19:00", temp: "19°", condition: "Parcialmente nublado"}
    ];
    // 3. Generación del HTML
    const forecastHTML = forecastData.map(renderForecastItem).join('');

    const main = document.createElement('main');
    main.innerHTML =`
    <!-- Main Content -->

        <div class="detail-container">
            <div class="container">
                <!-- Back Button -->
                <a href="#/" class="back-button">
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
                                <h1 class="detail-title">Ciudad de México</h1>
                                <p class="detail-coords">Lat: 19.4326 / Lon: -99.1332</p>
                            </div>
                        </div>
                        <span class="badge active" style="font-size: 1rem; padding: 0.5rem 1rem;">Activo</span>
                    </div>
                    <p class="detail-description">Monitoreo climático y ambiental en la zona metropolitana para prevención de contingencias ambientales y apoyo en la toma de decisiones para planeación urbana.</p>
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
                                        <span class="temp-number">22°</span>
                                        <span class="temp-unit">C</span>
                                    </div>
                                    <p class="temp-feels">Sensación térmica: 20°C</p>
                                </div>
                                <svg class="temp-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                            </div>

                            <!-- Metrics Grid -->
                            <div class="metrics-grid">
                                <div class="metric-card blue">
                                    <svg class="metric-icon blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                    </svg>
                                    <p class="metric-label">Viento</p>
                                    <p class="metric-value">15 km/h</p>
                                    <p class="metric-extra">NE</p>
                                </div>

                                <div class="metric-card sky">
                                    <svg class="metric-icon sky" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                                    </svg>
                                    <p class="metric-label">Precipitación</p>
                                    <p class="metric-value">0 mm</p>
                                </div>

                                <div class="metric-card teal">
                                    <svg class="metric-icon teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                    </svg>
                                    <p class="metric-label">Humedad</p>
                                    <p class="metric-value">65%</p>
                                </div>

                                <div class="metric-card purple">
                                    <svg class="metric-icon purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                    <p class="metric-label">Visibilidad</p>
                                    <p class="metric-value">10 km</p>
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
                                    <span class="sun-time">06:45</span>
                                </div>
                                <div class="sun-item">
                                    <div class="sun-label">
                                        <svg class="sun-icon sunset" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                        </svg>
                                        <span>Atardecer</span>
                                    </div>
                                    <span class="sun-time">19:30</span>
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
                                    <p class="update-date">21 de enero, 2026 - 13:45</p>
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
        </div>

  `;
    return main;
}
