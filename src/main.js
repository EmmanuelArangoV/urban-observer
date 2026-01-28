import {router} from './router/router.js';

export function render(view) {
    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = '';
        if (view) {
            app.appendChild(view);
        }
    }
}