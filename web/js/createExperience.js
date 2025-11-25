document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem("access_token"); 
    const form = document.getElementById('experienceForm');
    const resultElement = document.getElementById('form-result');
    
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            resultElement.innerHTML = '<p class="text-gray-500">Enviando datos...</p>';

            // 1. CREAR FORMDATA para manejar archivos
            const formData = new FormData(form);

            try {
                // 2. Enviar petición POST al backend
                const res = await fetch('http://localhost:3000/experiences', {
                    method: 'POST',
                    // ¡IMPORTANTE! NO establecer 'Content-Type': 
                    // El navegador lo hace automáticamente y necesario para FormData.
                    headers: {
                        'Authorization': `Bearer ${token}` // Token de autenticación
                    },
                    body: formData, // Enviar el objeto FormData
                });

                // 3. Manejar la respuesta
                if (res.ok) {
                    const experience = await res.json();
                    resultElement.innerHTML = `
                        <p class="text-green-600 font-semibold">
                            ✅ ¡Experiencia "${experience.title}" registrada con éxito!
                        </p>
                    `;
                    form.reset();
                } else {
                    const error = await res.json();
                    let message = 'Error: No se pudo guardar la experiencia.';

                    if (error.message && Array.isArray(error.message)) {
                        message = '❌ Faltan campos obligatorios o son inválidos: <ul class="list-disc list-inside text-left mx-auto max-w-xs mt-2">' + 
                                   error.message.map(m => `<li>${m}</li>`).join('') + 
                                   '</ul>';
                    } else if (error.message) {
                         message = `❌ Error del servidor: ${error.message}`;
                    }

                    resultElement.innerHTML = `<p class="text-red-600">${message}</p>`;
                }
            } catch (err) {
                resultElement.innerHTML = '<p class="text-red-600">❌ Error de conexión con el API.</p>';
            }
        });
    }
});