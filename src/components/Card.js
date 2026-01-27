export function Card(project = {}) {
    const {
        city = 'Ciudad',
        description = 'Descripción del proyecto',
        temperature = '0°C',
        wind = '0 km/h',
        rain = '0 mm',
        status = 'Activo',
        updated = 'Actualizado hace 0 min',
        detailHref = 'detail.html',
        favorite = false
    } = project;

    return `
    <article class="project-card">
      <div class="project-header">
        <div class="project-header-top">
          <div class="project-title-wrapper">
            <svg class="project-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <h3 class="project-title">${city}</h3>
          </div>
          <button class="favorite-button ${favorite ? 'active' : ''}" aria-label="Marcar como favorito">
            <svg class="favorite-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
            </svg>
          </button>
        </div>
        <span class="badge ${status === 'Activo' ? 'active' : ''}">${status}</span>
      </div>
      <div class="project-body">
        <p class="project-description">${description}</p>
        <div class="weather-grid">
          <div class="weather-item temp">
            <svg class="weather-icon temp" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <div class="weather-info">
              <span class="weather-label">Temp.</span>
              <span class="weather-value">${temperature}</span>
            </div>
          </div>
          <div class="weather-item wind">
            <svg class="weather-icon wind" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
            <div class="weather-info">
              <span class="weather-label">Viento</span>
              <span class="weather-value">${wind}</span>
            </div>
          </div>
          <div class="weather-item rain">
            <svg class="weather-icon rain" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
            </svg>
            <div class="weather-info">
              <span class="weather-label">Precip.</span>
              <span class="weather-value">${rain}</span>
            </div>
          </div>
        </div>
        <div class="project-footer">
          <div class="last-update">
            <svg class="calendar-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span>${updated}</span>
          </div>
          <a href="${detailHref}" class="btn btn-outline">Ver detalle</a>
        </div>
      </div>
    </article>`;
}
