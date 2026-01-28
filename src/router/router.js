import { render } from "../main.js";
import { DashboardView} from "../views/dashboard.js";

const routes = {
    'login': null,
    'register': null,
    'detail': null,
    'dashboard': DashboardView,
    'create-project': null,
}

export function router() {

    let hash = window.location.hash.slice(1);

    if (!hash ||  hash === '/') {
        hash = 'dashboard';
        window.location.hash = 'dashboard';
    }

    const viewFactory = routes[hash];

    if (viewFactory) {
        render(viewFactory());
    } else {
        console.error('Ruta no encontrada: ', hash);
        render(null)
    }

}