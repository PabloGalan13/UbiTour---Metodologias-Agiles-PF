// Obtiene el token usando la función global de auth.js
const token = checkAuthAndGetToken(); 

// Si el token existe, intenta cargar los datos
if (token) {
    async function fetchUser() {
        try {
            const res = await fetch("http://localhost:3000/auth/me", {
                headers: { Authorization: "Bearer " + token }
            });

            if (!res.ok) throw new Error();

            const user = await res.json();
            
            let providerOptions = '';
            
            if (user.role === 'PROVIDER') {
                providerOptions = `
                    <div class="mt-6 border-t pt-4 border-gray-200">
                        <p class="text-sm font-semibold text-gray-700 mb-2">Opciones de Proveedor:</p>
                        <a 
                            href="createExperience.html" 
                            class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-150 shadow-md"
                        >
                            ➕ Registrar Nueva Experiencia
                        </a>
                    </div>
                `;
            }
            
            document.getElementById("userBox").innerHTML = `
                <p class="mb-4">
                    <strong>Nombre:</strong> ${user.name}<br>
                    <strong>Email:</strong> ${user.email}<br>
                    <strong>Rol:</strong> <span class="font-bold text-blue-800">${user.role}</span>
                </p>
                ${providerOptions}
            `;
            
        } catch {
            document.getElementById("userBox").innerHTML = `
                Hubo un problema al cargar tus datos.
            `;
        }
    }
    fetchUser();
}