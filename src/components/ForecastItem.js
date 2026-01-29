
import {getWeatherIcon, getWeatherIconColor} from "../utils/helpers.js";

export function renderForecastItem (item) {
    return `
        <div class="forecast-item">
            <p class="forecast-time">${item.time}</p>
            <svg className="forecast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                 style="color: ${getWeatherIconColor(item.weatherCode)};">
                ${getWeatherIcon(item.weatherCode)}
            </svg>
            <p class="forecast-temp">${item.temperature}</p>
            <p class="forecast-condition">${item.condition}</p>
        </div>
            `;


}







