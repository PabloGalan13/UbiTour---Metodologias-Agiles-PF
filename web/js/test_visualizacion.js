document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('galleryContainer');
    const cargarPruebaBtn = document.getElementById('cargarPruebaBtn');
    const statusMessage = document.getElementById('statusMessage');

    // 🔑 DATOS DE PRUEBA: ESTO SIMULA LA RESPUESTA DE TU BASE DE DATOS
    // Usa URLs públicas reales para confirmar la funcionalidad del frontend
    const EXPERIENCIA_DE_PRUEBA = {
        title: "Experiencia de Test",
        // Array de URLs, similar a lo que guardas en tu campo 'photos'
        photos: ["http://localhost:3000/uploads/f18e1e1645e5edb45f9aa7068090eb07","http://localhost:3000/uploads/d75b446a5f865e3ee1023f17f7c60820","http://localhost:3000/uploads/7bfe2451da53ee086669afa1c91ddcf2"]
    };

    function renderImages(photosArray) {
        galleryContainer.innerHTML = '';
        if (photosArray.length === 0) {
            galleryContainer.innerHTML = '<p class="col-span-3 text-red-500">El array de fotos está vacío.</p>';
            return;
        }

        photosArray.forEach((url, index) => {
            const imgWrapper = document.createElement('article');
            imgWrapper.className = 'rounded-lg overflow-hidden shadow-md';
            
            const img = document.createElement('img');
            img.src = url;
            img.alt = `Foto de Experiencia ${index + 1}`;
            img.className = 'w-full h-auto object-cover';
            
            imgWrapper.appendChild(img);
            galleryContainer.appendChild(imgWrapper);
        });
        statusMessage.textContent = `Se cargaron ${photosArray.length} imágenes correctamente.`;
        statusMessage.classList.remove('text-gray-500');
        statusMessage.classList.add('text-green-600');
    }

    // Evento al hacer clic en el botón
    cargarPruebaBtn.addEventListener('click', () => {
        statusMessage.textContent = 'Simulando la obtención de datos...';
        statusMessage.classList.remove('text-green-600');
        statusMessage.classList.add('text-gray-500');

        // Simulamos un retraso de red de 500ms
        setTimeout(() => {
            renderImages(EXPERIENCIA_DE_PRUEBA.photos);
        }, 500);
    });
});