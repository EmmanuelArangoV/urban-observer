import { Card } from '../components/Card.js';
import { LoadingView} from "../components/Loading.js";
import JsonService from "../services/jsonService.js";

export function DashboardView() {
    const main = document.createElement('main');
    const loadingHtml = LoadingView();

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
                                <option value="activo">Activo</option>
                                <option value="finalizado">Finalizado</option>
                                <option value="pendiente">Pendiente</option>
                            </select>
                            <button type="button" class="filter-button">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
        </div>`;


    // Stats Section
    const statsSection = document.createElement('section');
    statsSection.classList.add('container');
    statsSection.innerHTML =
        ` <div class="stats-grid">
                <div class="stat-card green">
                    <p class="stat-label">Proyectos Activos</p>
                    <p class="stat-value">4</p>
                </div>
                <div class="stat-card yellow">
                    <p class="stat-label">En Desarrollo</p>
                    <p class="stat-value">1</p>
                </div>
                <div class="stat-card gray">
                    <p class="stat-label">Finalizados</p>
                    <p class="stat-value">1</p>
                </div>
            </div>`;

    // Projects Grid Section
    const projectSection = document.createElement('section');
    projectSection.classList.add('container');
    projectSection.innerHTML = `<div class="projects-grid"></div>`;

    const projectsGrid = projectSection.querySelector('.projects-grid');


    (async () => {
        try {
            projectsGrid.innerHTML = LoadingView();
            const projectIds = await JsonService.getProjectIds();
            const cardsArray = await Promise.all(projectIds.map(id => Card(id)));
            const cardsHtml = cardsArray.join('');
            projectsGrid.innerHTML = cardsHtml || `<p class="info">No hay proyectos disponibles.</p>`;
        } catch (error) {
            console.error('Error cargando proyectos:', error);
            projectsGrid.innerHTML = `<p class="error">No se pudieron cargar los proyectos. Intenta de nuevo más tarde.</p>`;
        }
    })();

    main.appendChild(searchSection);
    main.appendChild(statsSection);
    main.appendChild(projectSection);

    return main;
}


