import {Navbar } from "./components/Navbar.js";
import {renderFooter} from "./components/Footer.js";
import {router} from "./router/router.js";


const app = document.getElementById('app');

export function render(viewNode) {
    app.innerHTML = '';

    app.appendChild(Navbar());
    app.appendChild(viewNode);
    app.appendChild(renderFooter());
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
