import {register} from '../services/authService.js';

export function registerTemplate() {
    console.log('[REGISTER] Template cargado');

    const main = document.createElement('main');
    main.classList.add('auth-body');
    main.innerHTML = `
        <section class="auth-card">
            <header class="auth-header">
                <h1>Observatorio Urbano y Ambiental</h1>
                <p>Crear cuenta en plataforma GovTech</p>
            </header>
            <form class="auth-form" id="register-form">
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
                    <label for="register-role">Rol</label>
                    <select id="register-role" required>
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="city">Ciudad</label>
                    <input id="city" type="text" placeholder="Medellín" required />
                    <small class="form-hint">Escribe la ciudad y se autocompletarán las coordenadas</small>
                    <ul id="city-suggestions" class="suggestions-list hidden"></ul>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="latitude">Latitud</label>
                        <input id="latitude" type="text" placeholder="6.25" readonly required />
                    </div>
                    <div class="form-group">
                        <label for="longitude">Longitud</label>
                        <input id="longitude" type="text" placeholder="-75.56" readonly required />
                    </div>
                </div>
                
                <button type="button" id="btn-random" class="btn btn-secondary">
                    Generar datos aleatorios
                </button>
                
                <button type="submit" class="btn btn-primary">
                    Crear cuenta
                </button>
                
                <p class="auth-error hidden" id="auth-error">
                    Error al crear la cuenta. Verifica los datos.
                </p>
                
                <p class="auth-success hidden" id="auth-success">
                    ¡Cuenta creada exitosamente!
                </p>
            </form>
            <footer class="auth-footer">
                <p>¿Ya tienes cuenta? <a href="#login" class="auth-link">Inicia sesión</a></p>
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
    console.log('[REGISTER] Adjuntando event listeners');

    const btnRandom = document.getElementById('btn-random');
    const cityInput = document.getElementById('city');
    const form = document.getElementById('register-form');

    if (btnRandom) {
        console.log('[REGISTER] Botón aleatorio encontrado');
        btnRandom.addEventListener('click', fillRandomData);
    }

    if (cityInput) {
        console.log('[REGISTER] Input de ciudad encontrado');
        let debounceTimer;
        cityInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                searchCity(e.target.value);
            }, 500);
        });
    }

    if (form) {
        console.log('[REGISTER] Formulario encontrado');
        form.addEventListener('submit', handleRegister);
    }
}

async function fillRandomData() {
    console.log('[RANDOM USER] Solicitando datos aleatorios...');

    try {
        const response = await fetch('https://randomuser.me/api/');

        if (!response.ok) {
            throw new Error('Error al obtener datos aleatorios');
        }

        const data = await response.json();
        const user = data.results[0];

        console.log('[RANDOM USER] Datos obtenidos:', {
            nombre: `${user.name.first} ${user.name.last}`,
            email: user.email,
            ciudad: user.location.city,
            coordenadas: `${user.location.coordinates.latitude}, ${user.location.coordinates.longitude}`
        });

        document.getElementById('register-name').value =
            `${user.name.first} ${user.name.last}`;
        document.getElementById('register-email').value = user.email;
        document.getElementById('register-password').value = user.login.password;
        document.getElementById('register-confirm-password').value = user.login.password;
        document.getElementById('city').value = user.location.city;
        document.getElementById('latitude').value = user.location.coordinates.latitude;
        document.getElementById('longitude').value = user.location.coordinates.longitude;

        console.log('[RANDOM USER] Formulario rellenado exitosamente');

    } catch (error) {
        console.error('[RANDOM USER] Error:', error);
        showError('No se pudieron generar datos aleatorios');
    }
}

async function searchCity(cityName) {
    if (cityName.length < 2) {
        hideSuggestions();
        return;
    }

    console.log(`[GEOCODING] Buscando ciudades para: "${cityName}"`);

    try {
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=5&language=es&format=json`
        );

        if (!response.ok) {
            throw new Error('Error al buscar ciudades');
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
            console.log(`[GEOCODING] ${data.results.length} ciudades encontradas`);
            showSuggestions(data.results);
        } else {
            console.log('[GEOCODING] No se encontraron ciudades');
            hideSuggestions();
        }

    } catch (error) {
        console.error('[GEOCODING] Error al buscar ciudad:', error);
    }
}

function showSuggestions(cities) {
    console.log('[GEOCODING] Mostrando sugerencias de ciudades');

    const suggestionsList = document.getElementById('city-suggestions');
    suggestionsList.innerHTML = '';
    suggestionsList.classList.remove('hidden');

    cities.forEach(city => {
        const li = document.createElement('li');
        li.textContent = `${city.name}, ${city.country}`;
        li.classList.add('suggestion-item');

        li.addEventListener('click', () => {
            selectCity(city);
        });

        suggestionsList.appendChild(li);
    });
}

function hideSuggestions() {
    const suggestionsList = document.getElementById('city-suggestions');
    suggestionsList.classList.add('hidden');
    suggestionsList.innerHTML = '';
}

function selectCity(city) {
    console.log('[GEOCODING] Ciudad seleccionada:', {
        nombre: city.name,
        país: city.country,
        latitud: city.latitude,
        longitud: city.longitude
    });

    document.getElementById('city').value = city.name;
    document.getElementById('latitude').value = city.latitude;
    document.getElementById('longitude').value = city.longitude;
    hideSuggestions();
}

async function handleRegister(e) {
    e.preventDefault();
    console.log('[REGISTER] Iniciando proceso de registro...');

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const role = document.getElementById('register-role').value;
    const city = document.getElementById('city').value.trim();
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;

    console.log('[REGISTER] Datos del formulario:', {
        nombre: name,
        email: email,
        rol: role,
        ciudad: city,
        coordenadas: `${latitude}, ${longitude}`
    });

    // Validaciones
    if (!name || !email || !password || !city || !latitude || !longitude) {
        console.warn('[REGISTER] Validación fallida: Campos incompletos');
        showError('Por favor completa todos los campos');
        return;
    }

    if (password !== confirmPassword) {
        console.warn('[REGISTER] Validación fallida: Contraseñas no coinciden');
        showError('Las contraseñas no coinciden');
        return;
    }

    if (password.length < 3) {
        console.warn('[REGISTER] Validación fallida: Contraseña muy corta');
        showError('La contraseña debe tener al menos 6 caracteres');
        return;
    }

    console.log('[REGISTER] Validaciones pasadas correctamente');

    const userData = {
        name,
        email,
        password,
        role,
        city,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        createdAt: new Date().toISOString()
    };

    console.log('[REGISTER] Enviando datos al servidor...');
    const result = await register(userData);

    if (result.success) {
        console.log('[REGISTER] Usuario creado exitosamente:', result.user);

        localStorage.removeItem('activeUser');
        console.log('[REGISTER] localStorage limpiado');

        showSuccess('¡Cuenta creada exitosamente! Redirigiendo a login...');

        console.log('[REGISTER] Esperando 2 segundos antes de redirigir...');
        setTimeout(() => {
            console.log('[REGISTER] Redirigiendo a login...');
            window.location.hash = '#login';
            console.log('[REGISTER] Hash cambiado a #login');
        }, 200);
    } else {
        console.error('[REGISTER] Error al crear usuario:', result.error);
        showError(result.error);
    }
}

function showError(message) {
    console.error('[UI] Mostrando error:', message);

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
    console.log('[UI] Mostrando éxito:', message);

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
