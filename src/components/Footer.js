export function renderFooter() {
    const footer = document.createElement('footer');
    footer.classList.add('footer');
    footer.innerHTML = `
            <div class="footer-content">
            <div class="footer-grid">
                <div>
                    <h3 class="footer-section-title">Observatorio Urbano y Ambiental</h3>
                    <p class="footer-text">
                        Plataforma interactiva para consultar información climática y ambiental en tiempo real.
                        Apoyando la planeación urbana y la prevención de riesgos.
                    </p>
                </div>
                <div>
                    <h3 class="footer-section-title">Enlaces Útiles</h3>
                    <ul class="footer-links">
                        <li><a href="#">Acerca del proyecto</a></li>
                        <li><a href="#">Metodología</a></li>
                        <li><a href="#">Fuentes de datos</a></li>
                        <li><a href="#">Contacto</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="footer-section-title">Fuente de Datos</h3>
                    <p class="footer-text" style="margin-bottom: 0.75rem;">
                        Datos proporcionados por Open-Meteo API
                    </p>
                    <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" class="footer-link-external">
                        open-meteo.com →
                    </a>
                </div>
            </div>
            <div class="footer-copyright">
                <p>© 2026 Observatorio Urbano y Ambiental. Proyecto educativo para GovTech.</p>
            </div>
        </div>`;
    return footer;
}