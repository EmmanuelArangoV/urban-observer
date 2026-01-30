import { Card } from '../components/Card.js';
import { LoadingView } from "../components/Loading.js";
import JsonService from "../services/jsonService.js";

export function DashboardView() {
    const main = document.createElement('main');

    // Search Section
    const searchSection = document.createElement('section');
    searchSection.classList.add('search-section');
    searchSection.innerHTML =
        `<div class="container">
                <div class="search-container">
                    <form class="search-form">
                        <div class="search-input-wrapper">
                            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            <input type="text" class="search-input" placeholder="Buscar ciudad o proyecto...">
                        </div>
                        <div class="search-filters">
                            <select class="select-input">
                                <option value="">Todos los estados</option>
                            </select>
                            <button type="button" class="filter-button" onclick="window.location.hash='#create'">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
        </div>`;


    // Stats Section (dinámico)
    const statsSection = document.createElement('section');
    statsSection.classList.add('container');
    statsSection.innerHTML = `<div class="stats-grid" id="stats-grid"></div>`;
    const statsGrid = statsSection.querySelector('#stats-grid');

    // Projects Grid Section
    const projectSection = document.createElement('section');
    projectSection.classList.add('container');
    projectSection.innerHTML = `<div class="projects-grid"></div>`;

    const projectsGrid = projectSection.querySelector('.projects-grid');


    // Referencias a inputs
    const searchInput = searchSection.querySelector('.search-input');
    const statusSelect = searchSection.querySelector('.select-input');

    // Poblar select de estados dinámicamente
    (async () => {
        try {
            const statuses = await JsonService.getStatuses();
            statuses.forEach(s => {
                const opt = document.createElement('option');
                opt.value = s; // ya está en minúscula
                // Capitalizar la etiqueta para mejor presentación
                opt.textContent = s.charAt(0).toUpperCase() + s.slice(1);
                statusSelect.appendChild(opt);
            });
        } catch (error) {
            console.warn('No se pudieron cargar los estados dinámicos:', error);
        }
    })();

    // Debounce auxiliar
    function debounce(fn, wait = 300) {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn(...args), wait);
        };
    }

    // Función para actualizar los contadores de estadísticas en base a un conjunto de proyectos
    function capitalize(str = '') {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function updateStats(projects = []) {
        const counts = projects.reduce((acc, p) => {
            const s = (p.status || '').toString().trim().toLowerCase() || 'sin estado';
            acc[s] = (acc[s] || 0) + 1;
            acc._total = (acc._total || 0) + 1;
            return acc;
        }, { _total: 0 });

        // Orden preferido para mostrar: Total, Activo, Pendiente, Finalizado, luego el resto
        const preferred = ['activo', 'pendiente', 'finalizado'];
        const cards = [];

        // Total
        cards.push(`<div class="stat-card green">
                        <p class="stat-label">Total Proyectos</p>
                        <p class="stat-value">${counts._total || 0}</p>
                    </div>`);

        preferred.forEach(k => {
            cards.push(`<div class="stat-card ${k === 'activo' ? 'green' : k === 'pendiente' ? 'yellow' : 'gray'}">
                            <p class="stat-label">${capitalize(k)}</p>
                            <p class="stat-value">${counts[k] || 0}</p>
                        </div>`);
        });

        // Otros estados que no estén en preferred
        Object.keys(counts).filter(k => k !== '_total' && !preferred.includes(k)).forEach(k => {
            cards.push(`<div class="stat-card gray">
                            <p class="stat-label">${capitalize(k)}</p>
                            <p class="stat-value">${counts[k] || 0}</p>
                        </div>`);
        });

        statsGrid.innerHTML = cards.join('');
    }

    /**
     * Filtra y renderiza proyectos según texto y estado.
     * Esta función obtiene los proyectos desde JsonService.searchProjects,
     * crea las cards y las inyecta en el grid.
     * @param {string} text
     * @param {string} status
     */
    async function filterAndRenderProjects(text = '', status = '') {
        try {
            projectsGrid.innerHTML = LoadingView();
            const projects = await JsonService.searchProjects(text, status);

            // Actualizar estadísticas según los proyectos filtrados (muestra el conteo del conjunto actual)
            updateStats(projects);

            if (!projects || projects.length === 0) {
                projectsGrid.innerHTML = `<p class="info">No hay proyectos que coincidan con la búsqueda.</p>`;
                return;
            }

            // Crear las cards de forma paralela
            const cardsArray = await Promise.all(projects.map(p => Card(p.id)));
            projectsGrid.innerHTML = cardsArray.join('');
        } catch (error) {
            console.error('Error filtrando proyectos:', error);
            projectsGrid.innerHTML = `<p class="error">No se pudieron cargar los proyectos. Intenta de nuevo más tarde.</p>`;
        }
    }

    // --- Lógica de favoritos (delegación) ---
    // Queremos permitir:
    //  - Marcar/Desmarcar favorito y persistir en el servidor (PATCH a /projects/:id)
    //  - Actualizar la UI inmediatamente (optimistic UI)
    //  - Re-renderizar la lista para que los favoritos aparezcan primero

    // Estado para prevenir múltiples toggles en paralelo por proyecto
    const toggling = new Set();

    // Delegamos el click en projectsGrid
    projectsGrid.addEventListener('click', async (e) => {
        const btn = e.target.closest('.favorite-button');
        if (!btn) return;

        const projectId = btn.getAttribute('data-project-id');
        if (!projectId) return;

        // Evitar toggles concurrentes en el mismo proyecto
        if (toggling.has(projectId)) return;

        toggling.add(projectId);

        try {
            // UI optimista: cambiar estado visual inmediatamente
            const isActive = btn.classList.contains('active');
            if (isActive) btn.classList.remove('active'); else btn.classList.add('active');

            // Llamada al servicio para persistir el cambio
            await JsonService.toggleFavorite(projectId, !isActive);

            // Re-run filter y render para aplicar orden de favoritos primero
            const currentQuery = searchInput.value;
            const currentStatus = statusSelect.value;
            await filterAndRenderProjects(currentQuery, currentStatus);
        } catch (error) {
            console.error('No se pudo togglear favorito', error);
            // Si falla, revertir la UI optimista
            btn.classList.toggle('active');
            alert('No se pudo actualizar el favorito. Intenta de nuevo.');
        } finally {
            toggling.delete(projectId);
        }
    });

    // Carga inicial: todos los proyectos
    (async () => {
        await filterAndRenderProjects();
    })();

    // Enlazar eventos con debounce
    const debouncedFilter = debounce(() => filterAndRenderProjects(searchInput.value, statusSelect.value), 300);

    searchInput.addEventListener('input', debouncedFilter);
    statusSelect.addEventListener('change', debouncedFilter);

    main.appendChild(searchSection);
    main.appendChild(statsSection);
    main.appendChild(projectSection);

    return main;
}
