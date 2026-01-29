import {debounce} from "../utils/helpers";
import geocodingService from "../services/geocodingService"
import jsonService from "../services/jsonService";
import router from "../router/router";

export function renderCreateProject() {
    const app = document.getElementById('main');

    app.innerHTML = `

     <!-- Header -->
    <main>
      <section class="search-section">
        <div class="container" style="max-width: 800px; margin: 0 auto; padding: 0 1rem;">
          <a href="#/" class="back-button" style="margin-bottom: 1.5rem;">
            <svg class="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Volver al listado
          </a>

          <div style="background: white; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 2rem; max-width: 600px; margin: 0 auto;">
            <h1 style="font-size: 1.5rem; font-weight: 600; color: #111827; margin-bottom: 0.5rem;">
              Crear Nuevo Proyecto
            </h1><p style="color: #6b7280; margin-bottom: 2rem;">
              Registra un nuevo proyecto de monitoreo climático y ambiental
            </p>
            <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e5e7eb;">
              <h3 style="font-size: 0.875rem; font-weight: 600; color: #111827; margin-bottom: 0.5rem;">
                 Cómo usar el buscador
              </h3>
              <p style="font-size: 0.75rem; color: #6b7280; line-height: 1.5;">
                Escribe el nombre de una ciudad en el buscador y selecciona una de las opciones. 
                Las coordenadas se autocompletarán automáticamente usando la Geocoding API de Open-Meteo.
              </p>
            </div>

            <form id="create-project-form">
              <div style="margin-bottom: 1.5rem; padding-top: 2rem">
                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">
                  🔍 Buscar ciudad en Open-Meteo
                </label>
                <div style="position: relative;">
                  <input 
                    type="text" 
                    id="city-search-input" 
                    placeholder="Ej: Madrid, París, Nueva York..."
                    style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem;"
                  />
                  <div id="city-search-loader" style="display: none; position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; border: 2px solid #e5e7eb; border-top-color: #2563eb; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                </div>
                <div id="city-results" style="display: none; margin-top: 0.5rem; background: white; border: 1px solid #e5e7eb; border-radius: 0.375rem; max-height: 300px; overflow-y: auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"></div>
              </div>

              <div style="margin-bottom: 1.5rem;">
                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">
                  Nombre del Proyecto <span style="color: #ef4444;">*</span>
                </label>
                <input 
                  type="text" 
                  id="name-input" 
                  name="name"
                  placeholder="Ej: Monitoreo Ambiental Bogotá"
                  required
                  style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem;"
                />
              </div>

              <div style="margin-bottom: 1.5rem;">
                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">
                  Ciudad <span style="color: #ef4444;">*</span>
                </label>
                <input 
                  type="text" 
                  id="city-input" 
                  name="city"
                  placeholder="Ej: Bogotá"
                  required
                  readonly
                  style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem; background: #f9fafb;"
                />
                <p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;">
                  Se autocompletará al seleccionar una ciudad del buscador
                </p>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <div>
                  <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">
                    Latitud <span style="color: #ef4444;">*</span>
                  </label>
                  <input 
                    type="number" 
                    id="lat-input" 
                    name="lat"
                    placeholder="4.7110"
                    step="0.0001"
                    required
                    readonly
                    style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem; background: #f9fafb;"
                  />
                </div>
                <div>
                  <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">
                    Longitud <span style="color: #ef4444;">*</span>
                  </label>
                  <input 
                    type="number" 
                    id="lon-input" 
                    name="lon"
                    placeholder="-74.0721"
                    step="0.0001"
                    required
                    readonly
                    style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem; background: #f9fafb;"
                  />
                </div>
              </div>

              <div style="margin-bottom: 1.5rem;">
                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">
                  Descripción <span style="color: #ef4444;">*</span>
                </label>
                <textarea 
                  id="description-input" 
                  name="description"
                  placeholder="Describe el objetivo y alcance del proyecto..."
                  required
                  rows="4"
                  style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem; resize: vertical;"
                ></textarea>
              </div>

              <div style="margin-bottom: 1.5rem;">
                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">
                  Estado <span style="color: #ef4444;">*</span>
                </label>
                <select 
                  id="status-input" 
                  name="status"
                  required
                  style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem; background: white;"
                >
                  <option value="">Selecciona un estado</option>
                  <option value="activo">Activo</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="finalizado">Finalizado</option>
                </select>
              </div>

              <div id="form-error" style="display: none; background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 0.75rem; border-radius: 0.375rem; font-size: 0.875rem; margin-bottom: 1rem;"></div>

              <div id="form-success" style="display: none; background: #f0fdf4; border: 1px solid #86efac; color: #16a34a; padding: 0.75rem; border-radius: 0.375rem; font-size: 0.875rem; margin-bottom: 1rem;"></div>

              <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button 
                  type="button" 
                  id="cancel-btn"
                  style="padding: 0.75rem 1.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background: white; color: #374151; font-weight: 500; cursor: pointer;"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  id="submit-btn"
                  style="padding: 0.75rem 1.5rem; border: none; border-radius: 0.375rem; background: linear-gradient(to right, #2563eb, #14b8a6); color: white; font-weight: 500; cursor: pointer;"
                >
                  Crear Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
    <!-- Footer -->
  `;

    initCreateFormEvents();
    initCitySearchEvents();
}

function initCitySearchEvents() {
    const searchInput = document.getElementById('city-search-input');
    const resultsContainer = document.getElementById('city-results');
    const loader = document.getElementById('city-search-loader');
    const cityInput = document.getElementById('city-input');
    const latInput = document.getElementById('lat-input');
    const lonInput = document.getElementById('lon-input');
    const nameInput = document.getElementById('name-input');

    // Búsqueda con debounce
    const debouncedSearch = debounce(async (searchTerm) => {
        if (searchTerm.length < 2) {
            resultsContainer.style.display = 'none';
            return;
        }

        // Mostrar loader
        loader.style.display = 'block';

        try {
            const cities = await geocodingService.searchCity(searchTerm);

            // Ocultar loader
            loader.style.display = 'none';

            if (cities.length === 0) {
                resultsContainer.innerHTML = `
          <div style="padding: 1rem; text-align: center; color: #6b7280;">
            No se encontraron ciudades
          </div>
        `;
                resultsContainer.style.display = 'block';
                return;
            }

            // Renderizar resultados
            resultsContainer.innerHTML = cities.map(city => `
        <div class="city-result-item" data-city='${JSON.stringify(city)}' 
             style="padding: 0.75rem; cursor: pointer; border-bottom: 1px solid #f3f4f6; transition: background 0.2s;">
          <div style="font-weight: 500; color: #111827;">${city.name}</div>
          <div style="font-size: 0.75rem; color: #6b7280;">
            ${city.admin1 ? city.admin1 + ', ' : ''}${city.country}
          </div>
          <div style="font-size: 0.625rem; color: #9ca3af; margin-top: 0.25rem;">
            Lat: ${city.latitude.toFixed(4)}, Lon: ${city.longitude.toFixed(4)}
          </div>
        </div>
      `).join('');

            resultsContainer.style.display = 'block';

            // Eventos hover
            const items = resultsContainer.querySelectorAll('.city-result-item');
            items.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    item.style.background = '#f9fafb';
                });
                item.addEventListener('mouseleave', () => {
                    item.style.background = 'white';
                });
                item.addEventListener('click', () => {
                    const city = JSON.parse(item.dataset.city);
                    selectCity(city);
                });
            });

        } catch (error) {
            loader.style.display = 'none';
            resultsContainer.innerHTML = `
        <div style="padding: 1rem; text-align: center; color: #dc2626;">
          Error al buscar ciudades
        </div>
      `;
            resultsContainer.style.display = 'block';
        }
    }, 500);

    // Evento de búsqueda
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim();
        debouncedSearch(searchTerm);
    });

    // Cerrar resultados al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.style.display = 'none';
        }
    });

    // Función para seleccionar una ciudad
    function selectCity(city) {
        // Autocompletar campos
        cityInput.value = city.displayName;
        latInput.value = city.latitude;
        lonInput.value = city.longitude;

        // Sugerir nombre del proyecto
        if (!nameInput.value) {
            nameInput.value = `Monitoreo Ambiental ${city.name}`;
        }

        // Limpiar búsqueda
        searchInput.value = '';
        resultsContainer.style.display = 'none';

        // Feedback visual
        cityInput.style.borderColor = '#10b981';
        latInput.style.borderColor = '#10b981';
        lonInput.style.borderColor = '#10b981';

        setTimeout(() => {
            cityInput.style.borderColor = '#d1d5db';
            latInput.style.borderColor = '#d1d5db';
            lonInput.style.borderColor = '#d1d5db';
        }, 1000);
    }
}

/**
 * Inicializa los eventos del formulario
 */
function initCreateFormEvents() {
    const form = document.getElementById('create-project-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const submitBtn = document.getElementById('submit-btn');
    const formError = document.getElementById('form-error');
    const formSuccess = document.getElementById('form-success');

    // Botón cancelar
    cancelBtn.addEventListener('click', () => {
        router.navigate('/');
    });

    // Submit del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Ocultar mensajes previos
        formError.style.display = 'none';
        formSuccess.style.display = 'none';

        // Obtener datos del formulario
        const formData = new FormData(form);
        const projectData = {
            name: formData.get('name').trim(),
            city: formData.get('city').trim(),
            lat: parseFloat(formData.get('lat')),
            lon: parseFloat(formData.get('lon')),
            description: formData.get('description').trim(),
            status: formData.get('status')
        };

        // Validaciones
        if (!projectData.name || !projectData.city || !projectData.status) {
            formError.textContent = 'Por favor completa todos los campos obligatorios';
            formError.style.display = 'block';
            return;
        }

        if (isNaN(projectData.lat) || isNaN(projectData.lon)) {
            formError.textContent = 'Por favor selecciona una ciudad del buscador para obtener las coordenadas';
            formError.style.display = 'block';
            return;
        }

        // Deshabilitar botón
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creando...';

        try {
            // Crear el proyecto
            await jsonService.createProject(projectData);

            // Mostrar éxito
            formSuccess.textContent = '✓ Proyecto creado exitosamente. Redirigiendo...';
            formSuccess.style.display = 'block';

            // Resetear formulario
            form.reset();

            // Redirigir
            setTimeout(() => {
                router.navigate('/');
            }, 2000);

        } catch (error) {
            console.error('Error creando proyecto:', error);
            formError.textContent = error.message || 'Error al crear el proyecto';
            formError.style.display = 'block';

            submitBtn.disabled = false;
            submitBtn.textContent = 'Crear Proyecto';
        }
    });
}

