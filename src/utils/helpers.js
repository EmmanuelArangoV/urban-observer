export function formatDate(date) {
    const d = new Date(date);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return d.toLocaleDateString('es-ES', options);
}

export function getWeatherIcon(weatherCode) {
    const icons = {
        // Despejado (0, 1)
        clear: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z">
            </path>`,

        // Parcialmente nublado (2, 3)
        partlyCloudy: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                     d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z">
                   </path>
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                     d="M19 10h-1m-2-5h-1m2 2l-.5-.5" opacity="0.5">
                   </path>`,

        // Nublado (45, 48)
        cloudy: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
               d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z">
             </path>`,

        // Lluvia (51, 53, 55, 61, 63, 65, 80, 81, 82)
        rainy: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z">
            </path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M8 19v2m4-2v2m4-2v2">
            </path>`,

        // Nieve (71, 73, 75, 77, 85, 86)
        snowy: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z">
            </path>
            <circle cx="8" cy="20" r="1" fill="currentColor"/>
            <circle cx="12" cy="20" r="1" fill="currentColor"/>
            <circle cx="16" cy="20" r="1" fill="currentColor"/>`,

        // Tormenta (95, 96, 99)
        stormy: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
               d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z">
             </path>
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
               d="M13 10l-3 6h3l-3 6" fill="none">
             </path>`,

        // Niebla (45, 48)
        fog: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M4 12h16M4 16h16M4 20h16" opacity="0.6">
          </path>`
    };

    // Mapear códigos a íconos
    if (weatherCode === 0 || weatherCode === 1) return icons.clear;
    if (weatherCode === 2 || weatherCode === 3) return icons.partlyCloudy;
    if (weatherCode === 45 || weatherCode === 48) return icons.fog;
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) return icons.rainy;
    if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return icons.snowy;
    if ([95, 96, 99].includes(weatherCode)) return icons.stormy;

    return icons.cloudy; // Por defecto
}

/**
 * Obtiene el color del ícono según el código del clima
 * @param {number} weatherCode - Código del clima
 * @returns {string} Clase de color CSS
 */
export function getWeatherIconColor(weatherCode) {
    if (weatherCode === 0 || weatherCode === 1) return '#f59e0b'; // Amarillo/Naranja (sol)
    if (weatherCode === 2 || weatherCode === 3) return '#94a3b8'; // Gris claro
    if (weatherCode === 45 || weatherCode === 48) return '#9ca3af'; // Gris
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) return '#3b82f6'; // Azul (lluvia)
    if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return '#60a5fa'; // Azul claro (nieve)
    if ([95, 96, 99].includes(weatherCode)) return '#8b5cf6'; // Púrpura (tormenta)

    return '#6b7280'; // Gris por defecto
}

/**
 * Obtiene ícono de métrica climática
 * @param {string} type - Tipo de métrica (wind, rain, humidity, visibility)
 * @returns {string} SVG del ícono
 */
export function getMetricIcon(type) {
    const icons = {
        temperature: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z">
                  </path>`,

        wind: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
             d="M14 5l7 7m0 0l-7 7m7-7H3">
           </path>`,

        rain: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
             d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z">
           </path>`,

        humidity: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                 d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z">
               </path>`,

        visibility: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                   d="M15 12a3 3 0 11-6 0 3 3 0 016 0z">
                 </path>
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                   d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                 </path>`
    };

    return icons[type] || icons.wind;
}