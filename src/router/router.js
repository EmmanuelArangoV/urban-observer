import { render } from "../main.js";

const routes = {
    'login': null,
    'register': null,
    'detail': null,
    'dashboard': null,
    'create-project': null,
}

export function router() {

    let hash = window.location.hash.slice(1);

    if (!hash ||  hash === '/') {
        hash = 'login';
        window.location.hash = 'login';
    }

    const viewFactory = routes[hash];

    if (viewFactory) {
        render(viewFactory());
    } else {
        console.error('Ruta no encontrada: ', hash);
        render(null)
    }

}