import {
    getRandomUser,
    searchCityByName,
    getCityCoordinates,
    validateEmail,
    validatePasswordMatch
} from '../services/userService.js';

// ==================== TEMPLATE ====================
/**
 * Crea la estructura HTML del formulario de registro
 * @returns {HTMLElement} Elemento main con el formulario
 */
function registerTemplate() {
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
                <div class="form-group">
                    <label for="city">Ciudad</label>
                    <input id="city" type="text" placeholder="Medellín" required />
                    <small class="form-hint">Escribe la ciudad y se autocompletarán las coordenadas</small>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="latitude">Latitud</label>
                        <input id="latitude" type="text" placeholder="6.25" required />
                    </div>
                    <div class="form-group">
                        <label for="longitude">Longitud</label>
                        <input id="longitude" type="text" placeholder="-75.56" required />
                    </div>
                </div>
                <button type="button" id="btn-random" class="btn btn-secondary">
                    🎲 Generar datos aleatorios
                </button>
                <button type="submit" class="btn btn-primary">
                    Crear cuenta
                </button>
                <p class="auth-error hidden">
                    Error al crear la cuenta. Verifica los datos.
                </p>
            </form>
            <footer class="auth-footer">
                <p>¿Ya tienes cuenta? <a href="#login" class="auth-link">Inicia sesión</a></p>
                <p>Proyecto educativo – Riwi GovTech</p>
            </footer>
        </section>
    `;
    return main;
}

// ==================== LÓGICA Y EVENTOS ====================
/**
 * Página principal de registro con toda la funcionalidad
 * @returns {HTMLElement} Componente completo de registro
 */
export function registerPage() {
    const main = registerTemplate();
    const form = main.querySelector('.auth-form');
    const errorElement = form.querySelector('.auth-error');

    // Obtener referencias a los elementos del formulario
    const nameInput = form.querySelector('#register-name');
    const emailInput = form.querySelector('#register-email');
    const passwordInput = form.querySelector('#register-password');
    const confirmPasswordInput = form.querySelector('#register-confirm-password');
    const cityInput = form.querySelector('#city');
    const latitudeInput = form.querySelector('#latitude');
    const longitudeInput = form.querySelector('#longitude');
    const randomButton = form.querySelector('#btn-random');

    // ===== Event Listener: Generar datos aleatorios =====
    randomButton.addEventListener('click', async () => {
        try {
            randomButton.disabled = true;
            randomButton.innerHTML = '⏳ Cargando...';

            const userData = await getRandomUser();

            // Rellenar los campos del formulario
            nameInput.value = userData.fullName;
            emailInput.value = userData.email;
            passwordInput.value = userData.password;
            confirmPasswordInput.value = userData.password;
            latitudeInput.value = userData.latitude;
            longitudeInput.value = userData.longitude;
            cityInput.value = userData.city;

            randomButton.disabled = false;
            randomButton.innerHTML = '🎲 Generar datos aleatorios';

            showSuccess('Datos aleatorios generados correctamente');
        } catch (error) {
            showError('Error al generar datos aleatorios. Intenta de nuevo.');
            randomButton.disabled = false;
            randomButton.innerHTML = '🎲 Generar datos aleatorios';
        }
    });

    // ===== Event Listener: Buscar ciudad y autocompletar coordenadas =====
    let searchTimeout;

    cityInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);

        const cityName = e.target.value.trim();

        if (cityName.length >= 3) {
            // Mostrar indicador de búsqueda
            cityInput.style.borderColor = '#ffa500';

            searchTimeout = setTimeout(async () => {
                try {
                    const cityData = await getCityCoordinates(cityName);

                    // Autocompletar latitud y longitud
                    latitudeInput.value = cityData.latitude;
                    longitudeInput.value = cityData.longitude;

                    // Actualizar el campo ciudad con el nombre formateado
                    cityInput.value = cityData.city;
                    cityInput.style.borderColor = '#4CAF50';

                    setTimeout(() => {
                        cityInput.style.borderColor = '';
                    }, 2000);
                } catch (error) {
                    console.error('Error al buscar ciudad:', error);
                    cityInput.style.borderColor = '#f44336';

                    setTimeout(() => {
                        cityInput.style.borderColor = '';
                    }, 2000);
                }
            }, 500); // Esperar 500ms después de que el usuario deje de escribir
        }
    });

    // ===== Event Listener: Submit del formulario =====
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Recopilar datos del formulario
        const formData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value,
            confirmPassword: confirmPasswordInput.value,
            city: cityInput.value.trim(),
            latitude: latitudeInput.value.trim(),
            longitude: longitudeInput.value.trim()
        };

        // Validar campos vacíos
        if (!formData.name || !formData.email || !formData.password ||
            !formData.confirmPassword || !formData.city ||
            !formData.latitude || !formData.longitude) {
            showError('Todos los campos son obligatorios');
            return;
        }

        // Validar email
        if (!validateEmail(formData.email)) {
            showError('El correo electrónico no es válido');
            return;
        }

        // Validar contraseñas
        if (!validatePasswordMatch(formData.password, formData.confirmPassword)) {
            showError('Las contraseñas no coinciden o son muy cortas (mínimo 6 caracteres)');
            return;
        }

        // Validar coordenadas
        if (isNaN(formData.latitude) || isNaN(formData.longitude)) {
            showError('Las coordenadas deben ser valores numéricos');
            return;
        }

        // Guardar usuario en localStorage (o enviar a API)
        saveUser(formData);

        // Mostrar éxito y redirigir
        showSuccess('¡Cuenta creada exitosamente! Redirigiendo...');

        setTimeout(() => {
            window.location.hash = '#/login';
        }, 1500);
    });

    // ===== Funciones auxiliares =====

    /**
     * Muestra mensaje de error
     * @param {string} message - Mensaje a mostrar
     */
    function showError(message) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        errorElement.style.backgroundColor = '#ffebee';
        errorElement.style.color = '#c62828';

        setTimeout(() => {
            errorElement.classList.add('hidden');
        }, 4000);
    }

    /**
     * Muestra mensaje de éxito
     * @param {string} message - Mensaje a mostrar
     */
    function showSuccess(message) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        errorElement.style.backgroundColor = '#e8f5e9';
        errorElement.style.color = '#2e7d32';

        setTimeout(() => {
            errorElement.classList.add('hidden');
        }, 4000);
    }

    /**
     * Guarda el usuario en localStorage
     * @param {Object} userData - Datos del usuario
     */
    function saveUser(userData) {
        try {
            // Obtener usuarios existentes
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Verificar si el email ya existe
            const emailExists = users.some(user => user.email === userData.email);

            if (emailExists) {
                showError('Este correo electrónico ya está registrado');
                return false;
            }

            // Crear objeto de usuario
            const newUser = {
                id: Date.now(),
                name: userData.name,
                email: userData.email,
                password: userData.password, // En producción: hashear la contraseña
                city: userData.city,
                latitude: parseFloat(userData.latitude),
                longitude: parseFloat(userData.longitude),
                createdAt: new Date().toISOString()
            };

            // Agregar nuevo usuario
            users.push(newUser);

            // Guardar en localStorage
            localStorage.setItem('users', JSON.stringify(users));

            console.log('Usuario registrado:', newUser);
            return true;
        } catch (error) {
            console.error('Error al guardar usuario:', error);
            showError('Error al guardar el usuario. Intenta de nuevo.');
            return false;
        }
    }

    return main;
}
