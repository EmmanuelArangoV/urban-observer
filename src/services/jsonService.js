import {API_URLS} from "../utils/constants.js";

class JsonService {

    async getProjectIds() {
        try {
            
            const projects = await this.getProjects()
            const ids = projects.map(project => project.id);
            return ids;

        } catch (error) {
            console.error('Project IDs not obtained', error);
            throw new Error('Could not connect to the Projects API.');
        }
    }

    async getProjectById(projectId) {
        try {
            const response = await fetch(`${API_URLS.BASE_URL}/projects/${projectId}`);

            if (!response.ok) {
                throw new Error(`Proyecto no encontrado (HTTP ${response.status})`);
            }

            const project = await response.json();
            return project;

        } catch (error) {
            console.error(`Project ${projectId} not obtained`, error);
            throw new Error('Could not connect to the Projects API.');
        }
    }

    async getProjects() {
        try {
            const response = await fetch(`${API_URLS.BASE_URL}/projects`);
            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Projects not obtained', error);
            throw new Error('Could not connect to the Projects API.');
        }
    }

    /**
     * Crea un nuevo proyecto (POST)
     * @param {Object} project - Datos del nuevo proyecto
     * @returns {Promise<Object>} Proyecto creado
     */
    async createProject(project) {
        try{
            const response = await fetch(`${API_URLS.PROJECTS}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...project,
                    favorite: false,
                    createdAt: new Date().toISOString()
                }),
            });
            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status}`);
            }
            return await response.json();
        }catch(error) {
            console.error('Create project', project, ": ", error)
            throw new Error('Could not connect to the Projects API.');
        }
    }

    async updateProject(id, updates) {
        try{
            const response = await fetch(`${API_URLS.PROJECTS}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            })
            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status}`);
            }
            return await response.json();
        }
        catch(error) {
            console.error('Update project', error);
        }
    }

    // Nombre con typo mantenido por compatibilidad
    // Este método hace un PATCH que actualiza la propiedad `favorite` en el proyecto
    async tongleFavorite(id, isFavorite) {
        return this.updateProject(id, {favorite: isFavorite});
    }

    // Nombre correcto y preferido (usa updateProject internamente)
    // toggleFavorite(id, boolean) -> hace PATCH a /projects/:id con { favorite: boolean }
    async toggleFavorite(id, isFavorite) {
        return this.updateProject(id, {favorite: isFavorite});
    }

    /**
     * Devuelve una lista de ciudades únicas presentes en los proyectos
     * @returns {Promise<string[]>}
     */
    async getCities() {
        try {
            const projects = await this.getProjects();
            const cities = projects.map(p => p.city || '').filter(Boolean);
            const unique = Array.from(new Set(cities));
            return unique.sort();
        } catch (error) {
            console.error('Could not get cities', error);
            throw new Error('No se pudo obtener la lista de ciudades.');
        }
    }

    /**
     * Devuelve los estados únicos de los proyectos (en minúscula)
     * @returns {Promise<string[]>}
     */
    async getStatuses() {
        try {
            const projects = await this.getProjects();
            const statuses = projects.map(p => (p.status || '').toString().trim()).filter(Boolean).map(s => s.toLowerCase());
            const unique = Array.from(new Set(statuses));
            return unique.sort();
        } catch (error) {
            console.error('Could not get statuses', error);
            throw new Error('No se pudo obtener la lista de estados.');
        }
    }

    /**
     * Busca y/o filtra proyectos por texto (nombre o ciudad) y por estado.
     * Además, ordena los favoritos primero (favorite: true).
     * Devuelve una lista filtrada y ordenada lista para renderizar.
     * @param {string} query Texto a buscar en nombre o ciudad
     * @param {string} status Estado a filtrar (insensible a mayúsculas). Si vacío, no filtra por estado.
     * @returns {Promise<Array>} Proyectos filtrados
     */
    async searchProjects(query = '', status = '') {
        try {
            const projects = await this.getProjects();
            const q = (query || '').trim().toLowerCase();
            const s = (status || '').trim().toLowerCase();

            const filtered = projects.filter(p => {
                let matchesStatus = true;
                if (s) {
                    matchesStatus = (p.status || '').toString().toLowerCase() === s;
                }

                let matchesQuery = true;
                if (q) {
                    const name = (p.name || '').toLowerCase();
                    const city = (p.city || '').toLowerCase();
                    matchesQuery = name.includes(q) || city.includes(q);
                }

                return matchesStatus && matchesQuery;
            });

            // Ordenar: favoritos (true) primero y luego por fecha de creación descendente (si existe)
            filtered.sort((a, b) => {
                const af = a.favorite ? 1 : 0;
                const bf = b.favorite ? 1 : 0;
                if (af !== bf) return bf - af; // true first

                const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return tb - ta; // más reciente primero
            });

            return filtered;
        } catch (error) {
            console.error('Error searching projects', error);
            throw new Error('No se pudo buscar/filtrar proyectos.');
        }
    }

}

export default new JsonService();