// Array global para almacenar todos los archivos seleccionados de forma incremental
const uploadedFiles = [];

/**
 * Función que crea el elemento HTML de previsualización para una imagen.
 * Incluye un botón para eliminar la imagen del array.
 */
function createPreviewElement(file, index) {
    const reader = new FileReader();
    const previewContainer = document.getElementById('photos-preview');
    
    // Crear el wrapper principal con posición relativa para el botón de cerrar
    const elementWrapper = document.createElement('div');
    elementWrapper.className = 'relative w-24 h-24 rounded-lg overflow-hidden shadow-md border border-gray-200';
    elementWrapper.setAttribute('data-index', index);

    reader.onload = (e) => {
        // Elemento de imagen
        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'w-full h-full object-cover';
        elementWrapper.appendChild(img);

        // Botón de eliminar
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '×'; // Símbolo de multiplicación
        deleteButton.className = 'absolute top-0 right-0 bg-red-500 text-white w-6 h-6 flex items-center justify-center text-xs font-bold rounded-bl-lg transition duration-150 opacity-90 hover:opacity-100';
        deleteButton.onclick = (event) => {
            event.preventDefault();
            // Lógica para eliminar del array y re-renderizar
            uploadedFiles.splice(index, 1);
            renderPreviews();
        };
        elementWrapper.appendChild(deleteButton);
        
        previewContainer.appendChild(elementWrapper);
    };

    reader.readAsDataURL(file);
}

/**
 * Renderiza todas las miniaturas en el contenedor desde el array global `uploadedFiles`.
 */
function renderPreviews() {
    const previewContainer = document.getElementById('photos-preview');
    previewContainer.innerHTML = ''; // Limpiar el contenedor antes de renderizar

    // Recorrer el array global y crear los elementos
    uploadedFiles.forEach((file, index) => {
        createPreviewElement(file, index);
    });
}


/**
 * Maneja la selección de archivos de forma INCREMENTAL.
 */
function handleFileSelect(event) {
    const files = event.target.files;
    if (!files) return;

    // 1. Añadir los nuevos archivos al array global
    for (const file of files) {
        if (file.type.startsWith('image/')) {
            uploadedFiles.push(file);
        }
    }

    // 2. Renderizar el array completo
    renderPreviews();

    // 3. Resetear el campo input para permitir la selección incremental (CRÍTICO)
    // Esto evita que la nueva selección sustituya a la anterior en el objeto FileList nativo.
    event.target.value = null; 
}


document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem("access_token"); 
    const form = document.getElementById('experienceForm');
    const resultElement = document.getElementById('form-result');
    const photosInput = document.getElementById('photos');
    
    // 🔑 ENLACE DE PREVISUALIZACIÓN INCREMENTAL
    if (photosInput) {
        photosInput.addEventListener('change', handleFileSelect);
    }
    
    
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            resultElement.innerHTML = '<p class="text-gray-500">Enviando datos...</p>';

            // 1. CREAR FORMDATA A PARTIR DEL FORMULARIO
            const formData = new FormData(form);

            // 2. ELIMINAR EL CAMPO DE FOTOS DEL FORMULARIO
            // La versión nativa contiene una referencia al input, lo cual es incorrecto en este flujo.
            formData.delete('photos'); 
            
            // 3. ADJUNTAR LOS ARCHIVOS DEL ARRAY GLOBAL UNO POR UNO (CRÍTICO)
            uploadedFiles.forEach(file => {
                // El nombre 'photos' debe coincidir con FilesInterceptor('photos', ...) en el backend
                formData.append('photos', file, file.name); 
            });

            try {
                // 4. Enviar petición POST al backend
                const res = await fetch('http://localhost:3000/experiences', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}` 
                        // No Content-Type; el navegador lo hace por FormData.
                    },
                    body: formData, 
                });

                // 5. Manejar la respuesta
                if (res.ok) {
                    // Limpiar array y previsualización
                    uploadedFiles.length = 0; // Vacía el array
                    document.getElementById('photos-preview').innerHTML = ''; 
                    form.reset();
                    
                    const experience = await res.json();
                    resultElement.innerHTML = `
                        <p class="text-green-600 font-semibold">
                            ✅ ¡Experiencia "${experience.title}" registrada con éxito!
                        </p>
                    `;
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