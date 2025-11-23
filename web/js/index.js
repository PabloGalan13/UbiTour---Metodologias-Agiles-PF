/**
 * Lógica específica para index.html: 
 * Verifica si el usuario está logeado y actualiza la barra de navegación 
 * para mostrar el nombre del usuario y los enlaces de navegación interna.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Obtenemos el token desde localStorage. 
    const token = localStorage.getItem("access_token");

    // Contenedor de los botones que vamos a reemplazar
    const authButtonsContainer = document.querySelector('nav > div.flex.items-center.gap-3');

    if (token && authButtonsContainer) {
        // --- Lógica de decodificación ---
        function decodeJwt(token) {
            try {
                // El payload es la segunda parte del token (entre los puntos)
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                return JSON.parse(atob(base64)); 
            } catch (e) {
                return null;
            }
        }

        const payload = decodeJwt(token);
        // El nombre de usuario se usa para personalizar el botón.
        const userName = payload && payload.name ? payload.name.split(' ')[0] : 'Mi Panel';
        
        // ----------------------------------------------------
        // Reemplazar los botones para USUARIO LOGEADO
        // ----------------------------------------------------
        authButtonsContainer.innerHTML = `
            <a href="register-provider.html" class="px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100">
                Vende experiencias
            </a>
            
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
    // Si no hay token, los enlaces originales (Iniciar sesión, Vende experiencias, Registrarme)
    // que están en el HTML estático se mantienen, lo cual es el comportamiento deseado.
});

// Nota: La función logout() debe estar definida en js/auth.js