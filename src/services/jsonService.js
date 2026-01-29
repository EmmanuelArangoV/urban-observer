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

    async tongleFavorite(id, isFavorite) {
        return this.updateProject(id, {favorite: isFavorite});
    }

}

export default new JsonService();