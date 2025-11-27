// ----------------------------------------------------------------
// 1. LÓGICA DE FOTOS (SUBIDA INCREMENTAL)
// ----------------------------------------------------------------
const uploadedFiles = [];

function createPreviewElement(file, index) {
    const reader = new FileReader();
    const previewContainer = document.getElementById('photos-preview');
    
    const elementWrapper = document.createElement('div');
    elementWrapper.className = 'relative w-24 h-24 rounded-lg overflow-hidden shadow-md border border-gray-200';
    elementWrapper.setAttribute('data-index', index);

    reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'w-full h-full object-cover';
        elementWrapper.appendChild(img);

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '×'; 
        deleteButton.className = 'absolute top-0 right-0 bg-red-500 text-white w-6 h-6 flex items-center justify-center text-xs font-bold rounded-bl-lg transition duration-150 opacity-90 hover:opacity-100';
        deleteButton.onclick = (event) => {
            event.preventDefault();
            uploadedFiles.splice(index, 1);
            renderPreviews();
        };
        elementWrapper.appendChild(deleteButton);
        previewContainer.appendChild(elementWrapper);
    };
    reader.readAsDataURL(file);
}

function renderPreviews() {
    const previewContainer = document.getElementById('photos-preview');
    previewContainer.innerHTML = '';
    uploadedFiles.forEach((file, index) => {
        createPreviewElement(file, index);
    });
}

function handleFileSelect(event) {
    const files = event.target.files;
    if (!files) return;

    for (const file of files) {
        if (file.type.startsWith('image/')) {
            uploadedFiles.push(file);
        }
    }
    renderPreviews();
    event.target.value = null; 
}

// ----------------------------------------------------------------
// 2. LÓGICA DE MAPA (LEAFLET)
// ----------------------------------------------------------------
let map;
let marker;

function initLeafletMap() {
    // Obregón
    const defaultLat = 27.486389; 
    const defaultLng = -109.940833;

    map = L.map('map').setView([defaultLat, defaultLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    marker = L.marker([defaultLat, defaultLng], {
        draggable: true
    }).addTo(map);

    marker.on('dragend', (event) => {
        const position = marker.getLatLng();
        updateMarkerPosition(position.lat, position.lng);
    });

    map.on('click', (e) => {
        marker.setLatLng(e.latlng);
        updateMarkerPosition(e.latlng.lat, e.latlng.lng);
    });

    updateMarkerPosition(defaultLat, defaultLng);
}

function updateMarkerPosition(lat, lng) {
    document.getElementById('latitude').value = lat;
    document.getElementById('longitude').value = lng;
    document.getElementById('coordDisplayLat').textContent = lat.toFixed(5);
    document.getElementById('coordDisplayLng').textContent = lng.toFixed(5);
}


// ----------------------------------------------------------------
// 3. LÓGICA PRINCIPAL Y ENVÍO (CON BOTÓN MANUAL)
// ----------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem("access_token"); 
    const form = document.getElementById('experienceForm');
    const resultElement = document.getElementById('form-result');
    const photosInput = document.getElementById('photos');
    
    // Elementos del Modal
    const modal = document.getElementById('successModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    // INICIAR MAPA
    initLeafletMap();

    // ENLACE DE FOTOS
    if (photosInput) {
        photosInput.addEventListener('change', handleFileSelect);
    }
    
    // EVENTO PARA CERRAR EL MODAL MANUALMENTE
    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        });
    }
    
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerText = "Guardando...";
            resultElement.innerHTML = ''; 

            const formData = new FormData(form);

            const latitude = parseFloat(document.getElementById('latitude').value);
            const longitude = parseFloat(document.getElementById('longitude').value);
            
            formData.set('location', JSON.stringify({
                lat: latitude,
                lng: longitude,
                address: "Ubicación seleccionada en mapa" 
            }));
            
            formData.delete('latitude');
            formData.delete('longitude');

            formData.delete('photos'); 
            if (uploadedFiles.length > 0) {
                uploadedFiles.forEach(file => {
                    formData.append('photos', file, file.name); 
                });
            }

            try {
                const res = await fetch('http://localhost:3000/experiences', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}` 
                    },
                    body: formData, 
                });

                if (res.ok) {
                    const experience = await res.json();
                    
                    // --- MOSTRAR MODAL (SIN TIMER) ---
                    const modalMessage = document.getElementById('modalMessage');

                    if (modalMessage) {
                        modalMessage.textContent = `¡La experiencia "${experience.title}" ha sido publicada exitosamente!`;
                    }

                    if (modal) {
                        modal.classList.remove('hidden');
                        modal.classList.add('flex'); 
                    }

                    // Limpiar Formulario y Estado (Detrás del modal)
                    uploadedFiles.length = 0; 
                    document.getElementById('photos-preview').innerHTML = ''; 
                    resultElement.innerHTML = ''; 
                    form.reset();
                    
                    // Resetear mapa
                    const defaultLat = 27.486389;
                    const defaultLng = -109.940833;
                    if (marker && map) {
                        marker.setLatLng([defaultLat, defaultLng]);
                        map.setView([defaultLat, defaultLng], 13);
                        updateMarkerPosition(defaultLat, defaultLng);
                    }

                } else {
                    const error = await res.json();
                    let message = 'Error: No se pudo guardar la experiencia.';

                    if (error.message && Array.isArray(error.message)) {
                        message = 'Faltan campos obligatorios o son inválidos: <ul class="list-disc list-inside text-left mx-auto max-w-xs mt-2">' + 
                                   error.message.map(m => `<li>${m}</li>`).join('') + 
                                   '</ul>';
                    } else if (error.message) {
                         message = `Error del servidor: ${error.message}`;
                    }

                    resultElement.innerHTML = `<p class="text-red-600">${message}</p>`;
                }
            } catch (err) {
                resultElement.innerHTML = '<p class="text-red-600">Error de conexión con el API.</p>';
                console.error(err);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });
    }
});