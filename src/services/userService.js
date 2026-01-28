import {API_URLS} from '../utils/constants.js';

/**
 * Obtiene un usuario aleatorio de la API RandomUser
 * Extrae: nombre completo, email, contraseña, coordenadas y ciudad
 * @returns {Promise<Object>} Objeto con los datos del usuario
 */
export async function getRandomUser() {
    try {
        const response = await fetch(`${API_URLS.RAMDON_USER}api/?inc=name,email,login,location`);

        if (!response.ok) {
            throw new Error('Error al obtener usuario aleatorio');
        }

        const data = await response.json();
        const user = data.results[0];

        // Extraer y formatear los datos necesarios
        return {
            fullName: `${user.name.first} ${user.name.last}`,
            firstName: user.name.first,
            lastName: user.name.last,
            email: user.email,
            password: user.login.password,
            latitude: user.location.coordinates.latitude,
            longitude: user.location.coordinates.longitude,
            city: `${user.location.city}, ${user.location.state}, ${user.location.country}`
        };
    } catch (error) {
        console.error('Error en getRandomUser:', error);
        throw error;
    }
}

/**
 * Busca una ciudad por nombre y obtiene sus coordenadas
 * Utiliza la API de Geocoding de Open-Meteo
 * @param {string} cityName - Nombre de la ciudad a buscar
 * @returns {Promise<Array>} Array con los resultados encontrados
 */
export async function searchCityByName(cityName) {
    try {
        if (!cityName || cityName.trim().length < 2) {
            throw new Error('El nombre de la ciudad debe tener al menos 2 caracteres');
        }

        const url = `${API_URLS.GEOCODING}?name=${encodeURIComponent(cityName)}&count=5&language=es&format=json`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error al buscar la ciudad');
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return [];
        }

        // Formatear los resultados
        return data.results.map(location => ({
            id: location.id,
            name: location.name,
            latitude: location.latitude,
            longitude: location.longitude,
            country: location.country || '',
            admin1: location.admin1 || '', // Estado/Provincia
            city: formatCityName(location),
            population: location.population || 0,
            timezone: location.timezone || ''
        }));
    } catch (error) {
        console.error('Error en searchCityByName:', error);
        throw error;
    }
}

/**
 * Obtiene información de una ciudad específica (primera coincidencia)
 * @param {string} cityName - Nombre de la ciudad
 * @returns {Promise<Object>} Objeto con datos de la ciudad
 */
export async function getCityCoordinates(cityName) {
    try {
        const results = await searchCityByName(cityName);

        if (results.length === 0) {
            throw new Error('Ciudad no encontrada');
        }

        // Retornar la primera coincidencia
        return results[0];
    } catch (error) {
        console.error('Error en getCityCoordinates:', error);
        throw error;
    }
}

/**
 * Busca ciudades por coordenadas (geocodificación inversa)
 * Nota: Open-Meteo no ofrece geocodificación inversa directamente
 * Esta función busca la ciudad más cercana a las coordenadas dadas
 * @param {number} latitude - Latitud
 * @param {number} longitude - Longitud
 * @returns {Promise<Object|null>} Datos de la ciudad más cercana
 */
export async function getCityByCoordinates(latitude, longitude) {
    try {
        // Validar coordenadas
        if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
            throw new Error('Coordenadas inválidas');
        }

        // Open-Meteo no tiene reverse geocoding, así que buscamos ciudades cercanas
        // Esta es una solución alternativa limitada
        console.warn('Open-Meteo no soporta geocodificación inversa directamente');

        return {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            city: 'Ubicación personalizada',
            message: 'Para obtener el nombre de la ciudad, use searchCityByName'
        };
    } catch (error) {
        console.error('Error en getCityByCoordinates:', error);
        throw error;
    }
}

/**
 * Formatea el nombre completo de la ciudad con país y región
 * @param {Object} location - Objeto de ubicación de la API
 * @returns {string} Nombre formateado de la ciudad
 */
function formatCityName(location) {
    const parts = [location.name];

    if (location.admin1) {
        parts.push(location.admin1);
    }

    if (location.country) {
        parts.push(location.country);
    }

    return parts.join(', ');
}

/**
 * Valida el formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} True si el email es válido
 */
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Valida que las contraseñas coincidan
 * @param {string} password - Contraseña
 * @param {string} confirmPassword - Confirmación de contraseña
 * @returns {boolean} True si las contraseñas coinciden
 */
export function validatePasswordMatch(password, confirmPassword) {
    return password === confirmPassword && password.length >= 6;
}
