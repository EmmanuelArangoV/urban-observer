import { render } from '../main.js';
import { DashboardView } from '../views/dashboard.js';
import { loginTemplate } from '../views/login.js';
import { registerTemplate } from '../views/register.js';
import { renderDetailView } from '../views/detail.js';
import { getCurrentUser } from '../services/authService.js';

const routes = {
    '': DashboardView,
    'dashboard': DashboardView,
    'login': loginTemplate,
    'register': registerTemplate,
    'detail': renderDetailView
};

// Rutas que no requieren autenticación
const publicRoutes = ['login', 'register'];

export async function router() {
    // 1. Obtener el hash limpio (ej: "#/detail/1" -> "/detail/1")
    const hash = window.location.hash.slice(1) || '/';

    // 2. Dividirlo en partes
    const parts = hash.split('/');
    const routeName = parts[0] || 'dashboard'; // Por defecto dashboard si está vacío
    const param = parts[1];

    // 3. Verificar sesión
    const user = getCurrentUser();

    // 4. Lógica de protección de rutas
    if (!user && !publicRoutes.includes(routeName)) {
        // Si no hay usuario y la ruta no es pública, mandar al login
        window.location.hash = '#login';
        return;
    }

    if (user && (routeName === 'login' || routeName === 'register')) {
        // Si ya hay usuario y quiere ir al login/registro, mandar al dashboard
        window.location.hash = '#dashboard';
        return;
    }

    // 5. Renderizar vista
    const viewFn = routes[routeName];

    if (viewFn) {
        render(await viewFn(param));
    } else {
        console.error('Ruta no encontrada:', routeName);
        window.location.hash = '#dashboard';
    }
}
