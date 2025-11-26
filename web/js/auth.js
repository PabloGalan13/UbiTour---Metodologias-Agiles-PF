/**
 * Define las rutas del frontend que requieren un token de autenticación
 * para ser accesibles.
 */
const PROTECTED_PATHS = [
    'dashboard.html',
    'createExperience.html'
];

/**
 * Verifica si hay un token de sesión y, si es nulo, 
 * redirige al usuario a la página de login SÓLO si está intentando 
 * acceder a una página protegida.
 * * @returns {string | null} El token de acceso si existe.
 */
function checkAuthAndGetToken() {
    const token = localStorage.getItem("access_token");
    const currentPath = window.location.pathname;

    // 1. Verificar si la página actual es una ruta protegida
    // Usamos .some() para ver si la ruta actual incluye alguno de los paths protegidos
    const isProtected = PROTECTED_PATHS.some(path => currentPath.includes(path));

    // 2. Aplicar la lógica de restricción
    if (!token && isProtected) {
        // Redirige SÓLO si: 
        // a) Falta el token Y 
        // b) La página es una de las rutas protegidas (dashboard.html, etc.)
        window.location.href = "login.html";
        return null; // Detiene la ejecución del script en la página protegida
    }
    
    // Si hay token O si la página no es protegida (index.html, listados), retorna el token y permite el acceso.
    return token;
}

/**
 * Cierra la sesión del usuario eliminando el token y redirigiendo a la página principal.
 */
function logout() {
    localStorage.removeItem("access_token");
    window.location.href = "index.html"; 
}

// Ejecuta la verificación al cargar el script.
// Solo redirigirá si la página actual está en PROTECTED_PATHS y no hay token.
checkAuthAndGetToken();