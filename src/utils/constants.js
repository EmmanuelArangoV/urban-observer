// constants.js
export const API_URLS = {
    WEATHER: 'https://api.open-meteo.com/v1/forecast',
    GEOCODING: 'https://geocoding-api.open-meteo.com/v1/search',
    RAMDON_USER: 'https://randomuser.me/',
    USERS: 'http://localhost:3000/users',
    PROJECTS: 'http://localhost:3000/projects'
};

// Códigos de clima Open-Meteo
export const WEATHER_CODES = {
    0: 'Despejado',
    1: 'Mayormente despejado',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Neblina',
    48: 'Niebla con escarcha',
    51: 'Llovizna ligera',
    53: 'Llovizna moderada',
    55: 'Llovizna densa',
    61: 'Lluvia ligera',
    63: 'Lluvia moderada',
    65: 'Lluvia fuerte',
    71: 'Nevada ligera',
    73: 'Nevada moderada',
    75: 'Nevada fuerte',
    77: 'Granizo',
    80: 'Chubascos ligeros',
    81: 'Chubascos moderados',
    82: 'Chubascos violentos',
    85: 'Nevadas ligeras',
    86: 'Nevadas fuertes',
    95: 'Tormenta',
    96: 'Tormenta con granizo ligero',
    99: 'Tormenta con granizo fuerte'
};