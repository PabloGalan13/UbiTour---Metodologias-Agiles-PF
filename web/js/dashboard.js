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

            document.getElementById("userBox").innerHTML = `
              <strong>Nombre:</strong> ${user.name}<br>
              <strong>Email:</strong> ${user.email}<br>
              <strong>Rol:</strong> ${user.role}
            `;
        } catch {
            document.getElementById("userBox").innerHTML = `
              Hubo un problema al cargar tus datos.
            `;
        }
    }
    fetchUser();
}