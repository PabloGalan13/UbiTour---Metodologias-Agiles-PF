/**
 * Verifica si hay un token de sesión. Si no hay, redirige a login.html.
 * @returns {string | null} El token de acceso si existe.
 */
function checkAuthAndGetToken() {
    const token = localStorage.getItem("access_token");

    // Revisa si la página actual NO es login.html o register.html
    if (!token && 
        !window.location.pathname.includes('login.html') && 
        !window.location.pathname.includes('register.html')) {
        
        window.location.href = "login.html";
        return null;
    }
    return token;
}

/**
 * Cierra la sesión del usuario eliminando el token y redirigiendo a la página principal.
 */
function logout() {
    localStorage.removeItem("access_token");
    // Redirigimos a la página principal, donde el header se actualizará
    window.location.href = "index.html"; 
}

// Llamar a la función al cargar cualquier script para asegurar que la sesión esté activa
checkAuthAndGetToken();