import {render} from "../main.js";
import {registerTemplate} from "../views/register.js";
import {loginTemplate} from "../views/login.js";
import {DashboardView} from "../views/dashboard.js"
import {renderDetailView} from "../views/detail.js";

const routes = {
    'login': loginTemplate,
    'register': registerTemplate,
    'detail': renderDetailView,
    'dashboard': DashboardView,
    'create-project': null,
}

export function router() {

    let hash = window.location.hash.slice(1);
    console.log('📍 [ROUTER] Hash actual:', hash || '(vacío)');

    if (!hash || hash === '/') {
        hash = 'detail';
        window.location.hash = 'detail';
    }

    const viewFactory = routes[hash];

    if (viewFactory) {
        render(viewFactory("f3c3"));
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
