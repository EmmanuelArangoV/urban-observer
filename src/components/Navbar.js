export function Navbar() {
    const header = document.createElement('header');
    header.classList.add('header');

    header.innerHTML =
        `<div class="header-content">
            <div class="header-brand">
                <svg class="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                </svg>
                <div>
                    <h1 class="header-title">Observatorio Urbano y Ambiental</h1>
                    <p class="header-subtitle">Información climática en tiempo real</p>
                </div>
            </div>
            <nav class="header-nav">
                <a href="index.html">Inicio</a>
                <a href="#">Proyectos</a>
                <a href="#">Acerca de</a>
            </nav>
        </div>`;

    return header;
}