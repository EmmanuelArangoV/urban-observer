import {login} from '../services/authService.js';

export function loginTemplate() {
    console.log('📄 [LOGIN] Template cargado');

    const main = document.createElement('main');
    main.classList.add('auth-body');

    main.innerHTML = `
        <section class="auth-card">
          <header class="auth-header">
            <h1>Observatorio Urbano y Ambiental</h1>
            <p>Acceso a plataforma GovTech</p>
          </header>

          <form class="auth-form" id="login-form">
            <div class="form-group">
              <label for="email">Correo electrónico</label>
              <input id="email" type="email" placeholder="admin@govtech.com" required />
            </div>

            <div class="form-group">
              <label for="password">Contraseña</label>
              <input id="password" type="password" placeholder="••••••••" required />
            </div>

            <button type="submit" class="btn btn-primary">
            <a href="#dashboard" class="auth-link"></a>
              Iniciar sesión
            </button>

            <p class="auth-error hidden" id="auth-error">
              Credenciales inválidas. Intenta nuevamente.
            </p>
            
            <p class="auth-success hidden" id="auth-success">
              ¡Inicio de sesión exitoso!
            </p>
          </form>

          <footer class="auth-footer">
            <p>¿No tienes cuenta? <a href="#register" class="auth-link">Regístrate aquí</a></p>
            <p>Proyecto educativo – Riwi GovTech</p>
          </footer>
        </section>
    `;

    setTimeout(() => {
        attachEventListeners();
    }, 0);

    return main;
}

function attachEventListeners() {
    console.log('🔗 [LOGIN] Adjuntando event listeners');

    const form = document.getElementById('login-form');

    if (form) {
        console.log('✅ [LOGIN] Formulario encontrado');
        form.addEventListener('submit', handleLogin);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    console.log('📝 [LOGIN] Iniciando proceso de login...');

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    console.log('📋 [LOGIN] Datos de login:', {email});

    // Validaciones
    if (!email || !password) {
        console.warn('⚠️ [LOGIN] Validación fallida: Campos vacíos');
        showError('Por favor completa todos los campos');
        return;
    }

    console.log('🚀 [LOGIN] Enviando credenciales al servidor...');

    const result = await login(email, password);

    if (result.success) {
        console.log('✅ [LOGIN] Login exitoso:', result.user);
        showSuccess('¡Inicio de sesión exitoso! Redirigiendo...');

        console.log('⏳ [LOGIN] Esperando 1.5 segundos antes de redirigir...');
        setTimeout(() => {
            console.log('🔄 [LOGIN] Redirigiendo a dashboard...');
            window.location.hash = '#dashboard';
            console.log('✅ [LOGIN] Hash cambiado a #dashboard');
        }, 1500);
    } else {
        console.error('❌ [LOGIN] Login fallido:', result.error);
        showError(result.error);
    }
}

function showError(message) {
    console.error('❌ [UI] Mostrando error:', message);

    const errorElement = document.getElementById('auth-error');
    const successElement = document.getElementById('auth-success');

    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }

    if (successElement) {
        successElement.classList.add('hidden');
    }

    setTimeout(() => {
        if (errorElement) {
            errorElement.classList.add('hidden');
        }
    }, 5000);
}

function showSuccess(message) {
    console.log('✅ [UI] Mostrando éxito:', message);

    const errorElement = document.getElementById('auth-error');
    const successElement = document.getElementById('auth-success');

    if (successElement) {
        successElement.textContent = message;
        successElement.classList.remove('hidden');
    }

    if (errorElement) {
        errorElement.classList.add('hidden');
    }
}
