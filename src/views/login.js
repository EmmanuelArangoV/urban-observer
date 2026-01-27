// Description: Template for the user registration page

export function loginTemplate() {
    const main = document.createElement('main');
    main.classList.add('auth-body');

    main.innerHTML = `
        <section class="auth-card">
          <header class="auth-header">
            <h1>Observatorio Urbano y Ambiental</h1>
            <p>Acceso a plataforma GovTech</p>
          </header>

          <form class="auth-form">
            <div class="form-group">
              <label for="email">Correo electrónico</label>
              <input id="email" type="email" placeholder="admin@govtech.com" required />
            </div>

            <div class="form-group">
              <label for="password">Contraseña</label>
              <input id="password" type="password" placeholder="••••••••" required />
            </div>

            <button type="submit" class="btn btn-primary">
              Iniciar sesión
            </button>

            <p class="auth-error hidden">
              Credenciales inválidas. Intenta nuevamente.
            </p>
          </form>

          <footer class="auth-footer">
            <p>Proyecto educativo – Riwi GovTech</p>
          </footer>
        </section>
    `;
    return main;
}
