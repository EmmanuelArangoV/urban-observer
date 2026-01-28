import {API_URLS} from "../utils/constants.js";

export async function login(email, password) {
    console.log('[AUTH SERVICE] Intentando login para:', email);

    try {
        const url = `${API_URLS.USERS}?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
        console.log('[AUTH SERVICE] URL de consulta:', url);

        const response = await fetch(url);

        if (!response.ok) {
            console.error('[AUTH SERVICE] Respuesta no OK:', response.status);
            throw new Error('Error al verificar credenciales');
        }

        const users = await response.json();
        console.log('[AUTH SERVICE] Respuesta recibida:', users);

        if (users.length === 0 || !Array.isArray(users)) {
            console.warn('[AUTH SERVICE] Usuario no encontrado o credenciales inválidas');
            throw new Error('Credenciales inválidas');
        }

        const user = users[0];
        console.log('[AUTH SERVICE] Usuario encontrado:', {
            id: user.id,
            nombre: user.name,
            email: user.email,
            rol: user.role
        });

        localStorage.setItem('activeUser', JSON.stringify(user));
        console.log('[AUTH SERVICE] Usuario guardado en localStorage');

        return {success: true, user};
    } catch (error) {
        console.error('[AUTH SERVICE] Error en login:', error.message);
        return {success: false, error: error.message};
    }
}

export async function register(userData) {
    console.log('[AUTH SERVICE] Intentando registrar usuario:', userData.email);

    try {
        const checkUrl = `${API_URLS.USERS}?email=${encodeURIComponent(userData.email)}`;
        console.log('[AUTH SERVICE] Verificando email existente:', checkUrl);

        const response = await fetch(checkUrl);

        if (!response.ok) {
            console.error('[AUTH SERVICE] Error al verificar email:', response.status);
            throw new Error('Error al verificar usuario existente');
        }

        const existingUsers = await response.json();
        console.log('[AUTH SERVICE] Usuarios existentes encontrados:', existingUsers.length);

        if (Array.isArray(existingUsers) && existingUsers.length > 0) {
            console.warn('[AUTH SERVICE] Email ya registrado');
            throw new Error('El correo electrónico ya está registrado');
        }

        console.log('[AUTH SERVICE] Email disponible, procediendo con registro...');
        console.log('[AUTH SERVICE] Enviando POST a:', API_URLS.USERS);

        const registerResponse = await fetch(API_URLS.USERS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!registerResponse.ok) {
            console.error('[AUTH SERVICE] Error en POST:', registerResponse.status);
            throw new Error('Error al registrar nuevo usuario');
        }

        const newUser = await registerResponse.json();
        console.log('[AUTH SERVICE] Usuario registrado exitosamente:', {
            id: newUser.id,
            nombre: newUser.name,
            email: newUser.email,
            rol: newUser.role
        });

        return {success: true, user: newUser};
    } catch (error) {
        console.error('[AUTH SERVICE] Error en registro:', error.message);
        return {success: false, error: error.message};
    }
}

export function getActiveUser() {
    console.log('[AUTH SERVICE] Obteniendo usuario activo de localStorage');
    const userJson = localStorage.getItem('activeUser');
    const user = userJson ? JSON.parse(userJson) : null;

    if (user) {
        console.log('[AUTH SERVICE] Usuario activo encontrado:', user.email);
    } else {
        console.log('[AUTH SERVICE] No hay usuario activo');
    }

    return user;
}

export function logout() {
    console.log('[AUTH SERVICE] Cerrando sesión...');
    localStorage.removeItem('activeUser');
    console.log('[AUTH SERVICE] Usuario removido de localStorage');
    window.location.hash = '#login';
    console.log('[AUTH SERVICE] Redirigido a login');
}
