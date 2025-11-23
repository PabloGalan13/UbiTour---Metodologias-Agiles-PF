/**
 * Lógica específica para index.html: 
 * Verifica si el usuario está logeado y actualiza la barra de navegación 
 * para mostrar el nombre del usuario y el enlace al dashboard.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Obtenemos el token desde localStorage. 
    // Usamos la función checkAuthAndGetToken del auth.js si quieres forzar la redirección aquí,
    // pero para el index.html, solo verificaremos la existencia.
    const token = localStorage.getItem("access_token");

    // Contenedor de los botones que vamos a reemplazar (asumiendo que tiene la estructura del index.html)
    const authButtonsContainer = document.querySelector('nav > div.flex.items-center.gap-3');

    if (token && authButtonsContainer) {
        // Lógica de decodificación (basada en el script anterior)
        function decodeJwt(token) {
            try {
                // El payload es la segunda parte del token (entre los puntos)
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                // Utilizamos atob para decodificar la base64
                return JSON.parse(atob(base64)); 
            } catch (e) {
                return null;
            }
        }

        const payload = decodeJwt(token);
        
        // El nombre de usuario se usa para personalizar el botón.
        const userName = payload && payload.name ? payload.name.split(' ')[0] : 'Mi Panel';

        // Reemplazar los botones
        authButtonsContainer.innerHTML = `
            <a
                href="dashboard.html"
                class="px-4 py-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 font-semibold"
            >
                ${userName}
            </a>
            <button
                onclick="logout()"
                class="px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100"
            >
                Cerrar sesión
            </button>
        `;
    }
    // Si no hay token, los botones de "Iniciar sesión" y "Registrarme" permanecen.
});

// Nota: La función logout() debe estar definida en js/auth.js