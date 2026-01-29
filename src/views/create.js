import { debounce } from '../utils/helpers.js';
import jsonService from '../services/jsonService.js';

/**
 * Vista para crear un nuevo proyecto (Rediseño Estético - Ambient Animation)
 */
export function renderCreateProject() {
    const main = document.createElement('main');

    // Estilos inline para layout, glassmorphism y elementos base
    const style = `
        <style>
            :root {
                --glass-bg: rgba(255, 255, 255, 0.65);
                --glass-border: rgba(255, 255, 255, 0.4);
                --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
                --primary: #3b82f6;
                --text-main: #1e293b;
                --text-secondary: #475569;
            }

            /* Container principal relativo para posicionar el fondo absoluto detrás */
            .page-wrapper {
                position: relative;
                min-height: 100vh;
                width: 100%;
                overflow: hidden; /* Para contener las nubes que se salen */
            }

            /* Fondo degradado suave */
            .ambient-bg {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 0;
                background: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
                background-size: 200% 200%;
                animation: softGradient 20s ease infinite;
            }

            @keyframes softGradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }

            /* Capa para elementos animados por JS (Nubes, Lluvia, Sol) */
            #ambient-layer {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
                pointer-events: none; /* Dejar pasar clicks al formulario */
            }

            /* Contenido (Glass Card) por encima del fondo */
            .content-layer {
                position: relative;
                z-index: 10;
                padding-top: 2rem;
                padding-bottom: 2rem;
            }

            .glass-card {
                background: var(--glass-bg);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border-radius: 24px;
                border: 1px solid var(--glass-border);
                box-shadow: var(--glass-shadow);
                padding: 3rem;
                max-width: 650px;
                margin: 0 auto;
            }

            .input-group { margin-bottom: 2rem; }
            
            .input-label {
                font-weight: 600;
                font-size: 0.95rem;
                color: var(--text-main);
                margin-bottom: 0.75rem;
                display: block;
            }

            .modern-input {
                width: 100%;
                padding: 1rem;
                border: 1px solid rgba(255,255,255,0.5);
                background: rgba(255,255,255,0.7);
                border-radius: 12px;
                font-size: 1rem;
                color: var(--text-main);
                transition: all 0.3s ease;
                box-sizing: border-box;
                font-family: inherit;
            }
            .modern-input:focus {
                outline: none;
                background: white;
                box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
                border-color: var(--primary);
            }

            /* Elementos animados CSS (clases que usará JS) */
            
            /* Nubes */
            .cloud {
                position: absolute;
                background: #fff;
                border-radius: 50%;
                opacity: 0.6;
                filter: blur(8px);
            }
            .cloud::after, .cloud::before {
                content: '';
                position: absolute;
                background: inherit;
                border-radius: 50%;
            }

            /* Lluvia */
            .rain-drop {
                position: absolute;
                width: 2px;
                background: rgba(255, 255, 255, 0.6);
                animation: rainFall linear infinite;
            }
            @keyframes rainFall {
                to { transform: translateY(100vh); }
            }

            /* Sol */
            .sun-ray {
                position: absolute;
                top: -100px;
                right: -100px;
                width: 600px;
                height: 600px;
                background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%);
                animation: sunPulse 10s ease-in-out infinite;
                z-index: 1;
            }
            @keyframes sunPulse {
                0%, 100% { transform: scale(1); opacity: 0.5; }
                50% { transform: scale(1.1); opacity: 0.8; }
            }

            /* Buttons */
            .btn-primary {
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                color: white;
                border: none;
                padding: 1rem 2rem;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                width: 100%;
                box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
            }
            .btn-primary:hover:not(:disabled) { transform: translateY(-2px); }

            .btn-secondary {
                background: rgba(255,255,255,0.5);
                color: var(--text-secondary);
                border: 1px solid transparent;
                padding: 1rem 2rem;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                width: 100%;
            }
            .btn-secondary:hover { background: white; }

            /* Results Dropdown */
            .search-results {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                margin-top: 0.5rem;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                max-height: 300px;
                overflow-y: auto;
                z-index: 50;
                border: 1px solid #e2e8f0;
            }
            .result-item {
                display: flex;
                align-items: center;
                padding: 0.75rem 1rem;
                cursor: pointer;
                transition: background 0.2s;
                border-bottom: 1px solid #f1f5f9;
            }
            .result-item:hover { background: #f8fafc; }
            
            .flag-img {
                width: 24px;
                height: 16px; 
                border-radius: 2px;
                margin-right: 12px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                object-fit: cover;
            }

            /* Header Title Gradients */
            .gradient-text {
                background: linear-gradient(135deg, #1e293b 0%, #3b82f6 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        </style>
    `;

    main.innerHTML = style + `
      <div class="page-wrapper">
        <!-- Background Layers -->
        <div class="ambient-bg"></div>
        <div id="ambient-layer"></div> <!-- JS animations go here -->

        <!-- Content -->
        <div class="content-layer">
            <div class="container" style="max-width: 1000px; margin: 0 auto; padding: 0 1rem;">
                <!-- Back Button -->
                <a href="#/" class="back-button" style="display: inline-flex; align-items: center; color: var(--text-secondary); text-decoration: none; font-weight: 600; margin-bottom: 1.5rem; background: rgba(255,255,255,0.4); padding: 0.5rem 1rem; border-radius: 99px; backdrop-filter: blur(4px);">
                    <svg style="width: 20px; height: 20px; margin-right: 0.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Volver al listado
                </a>

                <div class="glass-card">
                     <!-- Tip Box (Top) -->
                    <div style="background: rgba(239, 246, 255, 0.7); border-radius: 12px; padding: 1rem; margin-bottom: 2.5rem; border: 1px solid rgba(219, 234, 254, 0.5);">
                        <h3 style="font-size: 0.9rem; font-weight: 600; color: #1e40af; margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.5rem;">
                           <svg style="width: 18px; height: 18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                           Guía Rápida
                        </h3>
                        <p style="font-size: 0.85rem; color: #1e3a8a; line-height: 1.5;">
                            Usa el buscador para autocompletar la ubicación. Los campos de latitud y longitud son editables si necesitas ajustarlos manualmente.
                        </p>
                    </div>

                    <div style="text-align: center; margin-bottom: 3rem;">
                        <h1 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem; letter-spacing: -1px;" class="gradient-text">
                          Nuevo Proyecto
                        </h1>
                        <p style="color: var(--text-secondary); font-size: 1.1rem;">Configura tu estación de monitoreo</p>
                    </div>
                
                    <form id="create-project-form">
                        <!-- City Search -->
                        <div class="input-group">
                            <label class="input-label">Ciudad o Ubicación</label>
                            <div style="position: relative;">
                                <input 
                                    type="text" 
                                    id="city-search-input" 
                                    class="modern-input"
                                    placeholder="Escribe para buscar..."
                                    autocomplete="off"
                                />
                                <div id="city-search-loader" style="position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); display: none;">
                                    <div style="width: 20px; height: 20px; border: 2px solid #cbd5e1; border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                                </div>
                                <div id="city-results" class="search-results" style="display: none;"></div>
                            </div>
                        </div>
                        <input type="hidden" id="hidden-city-name" name="city_clean">

                        <!-- Lat/Lon -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
                            <div>
                                <label class="input-label">Latitud</label>
                                <input type="number" id="lat-input" name="lat" step="any" class="modern-input" placeholder="0.0000" required>
                            </div>
                            <div>
                                <label class="input-label">Longitud</label>
                                <input type="number" id="lon-input" name="lon" step="any" class="modern-input" placeholder="0.0000" required>
                            </div>
                        </div>

                        <!-- Project Name -->
                        <div class="input-group">
                            <label class="input-label">Nombre del Proyecto</label>
                            <input 
                                type="text" 
                                id="name-input" 
                                name="name"
                                class="modern-input"
                                placeholder="Ej: Observatorio Central"
                                required
                            />
                        </div>

                        <!-- Description -->
                        <div class="input-group">
                            <label class="input-label">Descripción</label>
                            <textarea 
                                id="description-input" 
                                name="description"
                                class="modern-input"
                                placeholder="Detalles del proyecto..."
                                rows="3"
                                required
                                style="resize: vertical;"
                            ></textarea>
                        </div>

                        <!-- Status -->
                        <div class="input-group">
                            <label class="input-label">Estado Inicial</label>
                            <div style="position: relative;">
                                <select id="status-input" name="status" class="modern-input" required style="appearance: none; cursor: pointer;">
                                    <option value="">Seleccionar...</option>
                                    <option value="Activo">Activo</option>
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Finalizado">Finalizado</option>
                                </select>
                                <div style="position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--text-secondary);">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                                </div>
                            </div>
                        </div>

                        <!-- Messages -->
                        <div id="form-error" style="display: none; background: rgba(254, 226, 226, 0.9); color: #ef4444; padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem; text-align: center; border: 1px solid #fecaca;"></div>
                        <div id="form-success" style="display: none; background: rgba(220, 252, 231, 0.9); color: #16a34a; padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem; text-align: center; border: 1px solid #bbf7d0;"></div>

                        <!-- Actions -->
                        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1rem; margin-top: 3rem;">
                            <button type="button" id="cancel-btn" class="btn-secondary">Cancelar</button>
                            <button type="submit" id="submit-btn" class="btn-primary">Crear Proyecto</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      </div>
    `;

    // Initialize logic
    initCreateFormEvents(main);
    initDirectSearchEvents(main);

    // Initialize Ambient Animations
    setTimeout(() => initAmbientAnimations(main.querySelector('#ambient-layer')), 100);

    return main;
}

/**
 * Generador de animación ambiental con JS
 * @param {HTMLElement} layer 
 */
function initAmbientAnimations(layer) {
    if (!layer) return;

    // 1. Sun Glow (Top Right)
    const sun = document.createElement('div');
    sun.className = 'sun-ray';
    layer.appendChild(sun);

    // 2. Clouds Generator
    const createCloud = () => {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';

        // Random sizes
        const width = 100 + Math.random() * 150;
        const height = width * 0.6;
        cloud.style.width = width + 'px';
        cloud.style.height = height + 'px';

        // Internal cloud shapes
        cloud.style.top = (Math.random() * 60) + '%';

        // Start position (offscreen left)
        cloud.style.left = '-250px';

        // Animation
        const duration = 20 + Math.random() * 40; // 20-60s
        cloud.style.transition = `transform ${duration}s linear`;

        // Append
        layer.appendChild(cloud);

        // Additional puffs for fluffy look
        const puff1 = document.createElement('div');
        puff1.style.position = 'absolute';
        puff1.style.background = 'inherit';
        puff1.style.width = (width * 0.5) + 'px';
        puff1.style.height = (width * 0.5) + 'px';
        puff1.style.borderRadius = '50%';
        puff1.style.top = -(width * 0.25) + 'px';
        puff1.style.left = (width * 0.1) + 'px';
        cloud.appendChild(puff1);

        const puff2 = document.createElement('div');
        puff2.style.position = 'absolute';
        puff2.style.background = 'inherit';
        puff2.style.width = (width * 0.4) + 'px';
        puff2.style.height = (width * 0.4) + 'px';
        puff2.style.borderRadius = '50%';
        puff2.style.top = -(width * 0.15) + 'px';
        puff2.style.right = (width * 0.1) + 'px';
        cloud.appendChild(puff2);

        // Trigger move
        requestAnimationFrame(() => {
            cloud.style.transform = `translateX(${window.innerWidth + 400}px)`;
        });

        // Cleanup
        setTimeout(() => {
            if (cloud.parentNode) cloud.parentNode.removeChild(cloud);
        }, duration * 1000);
    };

    // Spawn initial clouds
    createCloud();
    createCloud();

    // Interval spawn
    setInterval(createCloud, 8000);

    // 3. Rain Generator (Subtle)
    const createRain = () => {
        if (Math.random() > 0.7) return; // Not always raining

        const drop = document.createElement('div');
        drop.className = 'rain-drop';

        drop.style.left = Math.random() * 100 + '%';
        drop.style.top = '-20px';
        drop.style.height = (10 + Math.random() * 15) + 'px';
        drop.style.opacity = 0.3 + Math.random() * 0.3;

        const duration = 0.5 + Math.random() * 0.5;
        drop.style.animationDuration = duration + 's';

        layer.appendChild(drop);

        setTimeout(() => {
            if (drop.parentNode) drop.parentNode.removeChild(drop);
        }, duration * 1000);
    };

    setInterval(createRain, 100);
}

function initDirectSearchEvents(container) {
    const searchInput = container.querySelector('#city-search-input');
    const resultsContainer = container.querySelector('#city-results');
    const loader = container.querySelector('#city-search-loader');

    const latInput = container.querySelector('#lat-input');
    const lonInput = container.querySelector('#lon-input');
    const nameInput = container.querySelector('#name-input');
    const hiddenCityName = container.querySelector('#hidden-city-name');

    const debouncedSearch = debounce(async (searchTerm) => {
        if (searchTerm.length < 2) {
            resultsContainer.style.display = 'none';
            return;
        }

        loader.style.display = 'block';

        try {
            const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchTerm)}&count=5&language=es&format=json`;
            const response = await fetch(url);
            const data = await response.json();
            const cities = data.results || [];

            loader.style.display = 'none';

            if (cities.length === 0) {
                resultsContainer.innerHTML = `<div style="padding: 1rem; text-align: center; color: #94a3b8;">No se encontraron resultados</div>`;
                resultsContainer.style.display = 'block';
                return;
            }

            resultsContainer.innerHTML = cities.map(city => {
                const flagUrl = city.country_code
                    ? `https://open-meteo.com/images/country-flags/${city.country_code.toLowerCase()}.svg`
                    : null;

                const flagHtml = flagUrl
                    ? `<img src="${flagUrl}" class="flag-img" alt="${city.country_code}">`
                    : '<span style="display:inline-block;width:24px;margin-right:12px;">🏳️</span>';

                const locationStr = [city.admin1, city.country].filter(Boolean).join(', ');

                return `
                    <div class="result-item" data-json='${JSON.stringify(city)}'>
                        ${flagHtml}
                        <div>
                            <div style="font-weight: 600; color: #334155;">${city.name}</div>
                            <div style="font-size: 0.8rem; color: #94a3b8;">${locationStr}</div>
                        </div>
                    </div>
                `;
            }).join('');

            resultsContainer.style.display = 'block';

            container.querySelectorAll('.result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const city = JSON.parse(item.dataset.json);

                    latInput.value = city.latitude;
                    lonInput.value = city.longitude;
                    hiddenCityName.value = city.name;

                    if (!nameInput.value.trim()) {
                        nameInput.value = `Monitoreo ambiental de ${city.name}`;
                    }

                    searchInput.value = `${city.name}, ${city.admin1 || ''} ${city.country || ''}`;
                    resultsContainer.style.display = 'none';
                });
            });

        } catch (error) {
            console.error(error);
            loader.style.display = 'none';
        }
    }, 500);

    searchInput.addEventListener('input', (e) => debouncedSearch(e.target.value.trim()));

    document.addEventListener('click', (e) => {
        if (searchInput && resultsContainer && !searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.style.display = 'none';
        }
    });
}

function initCreateFormEvents(container) {
    const form = container.querySelector('#create-project-form');
    const cancelBtn = container.querySelector('#cancel-btn');
    const submitBtn = container.querySelector('#submit-btn');
    const formError = container.querySelector('#form-error');
    const formSuccess = container.querySelector('#form-success');

    cancelBtn.addEventListener('click', () => window.location.hash = '#/');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = container.querySelector('#name-input').value.trim();
        const description = container.querySelector('#description-input').value.trim();
        const status = container.querySelector('#status-input').value;
        const lat = parseFloat(container.querySelector('#lat-input').value);
        const lon = parseFloat(container.querySelector('#lon-input').value);

        const searchVal = container.querySelector('#city-search-input').value.trim();
        const hiddenVal = container.querySelector('#hidden-city-name').value.trim();
        const city = searchVal || hiddenVal;

        if (!name || !city || !status || isNaN(lat) || isNaN(lon)) {
            formError.textContent = 'Por favor completa todos los campos requeridos.';
            formError.style.display = 'block';
            return;
        }

        submitBtn.textContent = 'Guardando...';
        submitBtn.disabled = true;

        try {
            await jsonService.createProject({
                name, city, lat, lon, description, status
            });
            formSuccess.textContent = '¡Proyecto creado con éxito!';
            formSuccess.style.display = 'block';
            formError.style.display = 'none';
            form.reset();
            setTimeout(() => { window.location.hash = '#/'; }, 1500);
        } catch (error) {
            formError.textContent = error.message || 'Error al crear proyecto';
            formError.style.display = 'block';
            submitBtn.textContent = 'Crear Proyecto';
            submitBtn.disabled = false;
        }
    });
}
