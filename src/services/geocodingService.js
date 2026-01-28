import {API_URLS} from "../utils/constants";

class geocodingService{
    constructor() {}

    async searchCity(cityName, count = 10) {
        if (!cityName || cityName.trim().length < 2) {
            return [];
        }

        try{
            const url = `${API_URLS.GEOCODING}?name=${encodeURIComponent(cityName)}&count=${count}&languaje=es&format=json`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            //Momento de formatear para que las ciudades estén más bonitas c:
            if (!data.results || !data.results.length) {
                return [];
            }

            return data.results.map(city => ({
                id: city.id,
                name:city.name,
                lat: city.latitude,
                lon: city.longitude,
                country: city.country,
                countryCode: city.countryCode || ``,
                admin1: city.admin1,
                admin2: city.admin2,
                displayName: this.formatDisplayName(city)
            }));
        } catch (error) {
            console.error('Error buscando ciudad:', error);
            return [];
        }
    }
    /**
     * Formatea el nombre para mostrar (incluye país y región)
     * @param {Object} city - Datos de la ciudad
     * @returns {string} Nombre formateado
     */
    formatDisplayName(city) {
        let parts = [city.name];

        if (city.admin1) {
            parts.push(city.admin1);
        }

        if (city.country) {
            parts.push(city.country);
        }

        return parts.join(', ');
    }

}

// Exportar instancia única (Singleton)
export default new geocodingService();