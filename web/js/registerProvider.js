document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('providerRegisterForm');
    const messageElement = document.getElementById('message');

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            // 1. Recolectar datos del formulario
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Limpiar mensaje anterior
            messageElement.textContent = '';
            messageElement.className = 'mt-4 text-center text-sm';
            
            try {
                // 2. Enviar petición al endpoint de registro de proveedor
                const res = await fetch('http://localhost:3000/auth/register-provider', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, password }),
                });

                // 3. Manejar respuesta
                if (res.ok) {
                    const htmlResponse = await res.text();
                    messageElement.innerHTML = htmlResponse;
                    messageElement.classList.add('text-green-600');
                    // Limpiar formulario si el registro es exitoso
                    form.reset();
                } else {
                    // Manejar errores de validación (400 Bad Request)
                    const error = await res.json();
                    messageElement.textContent = error.message || 'Error al registrar el proveedor.';
                    messageElement.classList.add('text-red-500');
                }
            } catch (err) {
                // Manejar errores de red/servidor (500 o conexión)
                messageElement.textContent = 'Error de conexión con el servidor.';
                messageElement.classList.add('text-red-500');
            }
        });
    }
});