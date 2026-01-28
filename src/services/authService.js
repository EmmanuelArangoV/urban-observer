/* src/services/authService.js */
import {API_URLS} from "../utils/constants.js";

/**
 * Inicia sesión con email y contraseña.
 * Verifica si el usuario existe en la base de datos (db.json).
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export async function login(email, password) {
    try {
        // En un entorno real, esto sería una petición POST con body
        // Como usamos json-server, filtramos por email en la URL
        const response = await fetch(`${API_URLS.BASE_URL}/users?email=${email}`);

        if (!response.ok) {
            throw new Error('Error de conexión con el servidor');
        }

        const users = await response.json();
        const user = users[0];

        if (!user) {
            return { success: false, error: 'Usuario no encontrado' };
        }

        if (user.password !== password) {
            return { success: false, error: 'Contraseña incorrecta' };
        }

        // Guardamos el usuario activo en localStorage para persistencia básica
        // Nota: NO guardar contraseñas en localStorage en producción real
        const sessionUser = { ...user };
        delete sessionUser.password; // Quitamos la contraseña del objeto en memoria
        localStorage.setItem('activeUser', JSON.stringify(sessionUser));

        return { success: true, user: sessionUser };

    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Ocurrió un error inesperado' };
    }
}

/**
 * Registra un nuevo usuario en la base de datos.
 * Verifica primero si el email ya existe.
 *
 * @param {object} userData - Objeto con datos del usuario (name, email, password, etc.)
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export async function register(userData) {
    try {
        // 1. Verificar si el email ya existe
        const checkRef = await fetch(`${API_URLS.BASE_URL}/users?email=${userData.email}`);
        const existingUsers = await checkRef.json();

        if (existingUsers.length > 0) {
            return { success: false, error: 'El correo electrónico ya está registrado' };
        }

        // 2. Crear el usuario
        const response = await fetch(`${API_URLS.BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('No se pudo crear el usuario');
        }

        const newUser = await response.json();
        return { success: true, user: newUser };

    } catch (error) {
        console.error('Register error:', error);
        return { success: false, error: error.message || 'Error al registrar usuario' };
    }
}

/**
 * Cierra la sesión del usuario actual.
 */
export function logout() {
    localStorage.removeItem('activeUser');
    window.location.hash = '#login';
}

/**
 * Obtiene el usuario autenticado actualmente desde localStorage.
 * @returns {object|null}
 */
export function getCurrentUser() {
    const userStr = localStorage.getItem('activeUser');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch (e) {
        return null;
    }
}

/**
 * Verifica si hay un usuario autenticado.
 * @returns {boolean}
 */
export function isAuthenticated() {
    return !!getCurrentUser();
}
