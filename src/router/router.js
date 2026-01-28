import {render} from "../main.js";
import {registerTemplate} from "../views/register.js";
import {loginTemplate} from "../views/login.js";
import {DashboardView} from "../views/dashboard.js"

const routes = {
    'login': loginTemplate,
    'register': registerTemplate,
    'detail': null,
    'dashboard': DashboardView,
    'create-project': null,
}

export function router() {

    let hash = window.location.hash.slice(1);
    console.log('📍 [ROUTER] Hash actual:', hash || '(vacío)');

    if (!hash || hash === '/') {
        hash = 'login';
        window.location.hash = 'login';
    }

    const viewFactory = routes[hash];

    if (viewFactory) {
        render(viewFactory());
    } else {
        console.error('[ROUTER] Ruta no encontrada:', hash);
        render(null);
    }
}

// IMPORTANTE: Estos event listeners DEBEN estar al final del archivo

window.addEventListener('hashchange', () => {
    router();
});

window.addEventListener('DOMContentLoaded', () => {
    router();
});
