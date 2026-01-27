// Description: Template for the user registration page

export function registerTemplate() {
    const main = document.createElement('main');
    main.classList.add('auth-body');

    main.innerHTML = `
        <section class="auth-card">
          <header class="auth-header">
            <h1>Observatorio Urbano y Ambiental</h1>
            <p>Crear cuenta en plataforma GovTech</p>
          </header>

          <form class="auth-form">
            <div class="form-group">
              <label for="register-name">Nombre completo</label>
              <input id="register-name" type="text" placeholder="Juan Pérez" required />
            </div>

            <div class="form-group">
              <label for="register-email">Correo electrónico</label>
              <input id="register-email" type="email" placeholder="usuario@govtech.com" required />
            </div>

            <div class="form-group">
              <label for="register-password">Contraseña</label>
              <input id="register-password" type="password" placeholder="••••••••" required />
            </div>

            <div class="form-group">
              <label for="register-confirm-password">Confirmar contraseña</label>
              <input id="register-confirm-password" type="password" placeholder="••••••••" required />
            </div>

            <button type="submit" class="btn btn-primary">
              Crear cuenta
            </button>

            <p class="auth-error hidden">
              Error al crear la cuenta. Verifica los datos.
            </p>
          </form>

          <footer class="auth-footer">
            <p>¿Ya tienes cuenta? <a href="#/login" class="auth-link">Inicia sesión</a></p>
            <p>Proyecto educativo – Riwi GovTech</p>
          </footer>
        </section>
    `;
    return main;
}
