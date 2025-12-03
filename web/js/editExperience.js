const token = checkAuthAndGetToken();
const urlParams = new URLSearchParams(window.location.search);
const expId = urlParams.get("id");

let map, marker;
let selectedLat, selectedLng;
if (!token) window.location.href = "login.html";
if (!expId) window.location.href = "experienceList.html";


async function obtenerCiudad(lat, lng) {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=es`,
            { headers: { "User-Agent": "UbiTour" } }
        );

        const data = await res.json();

        return (
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.state ||
            "Ciudad desconocida"
        );

    } catch {
        return "Ciudad desconocida";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadExperience();

    document.getElementById("successBtn").onclick = () => {
        window.location.href = "experienceList.html";
    };

    document.getElementById("errorBtn").onclick = () => {
        window.location.href = "experienceList.html";
    };
});

async function loadExperience() {
    const res = await fetch("http://localhost:3000/experiences/my", {
        headers: { Authorization: "Bearer " + token }
    });

    const list = await res.json();
    const exp = list.find(e => e.id === expId);

    if (!exp) {
        showError("La experiencia no existe.");
        return;
    }

    document.getElementById("title").value = exp.title;
    document.getElementById("price").value = exp.price;
    document.getElementById("capacity").value = exp.capacity;
    document.getElementById("description").value = exp.description;

    document.getElementById("startAt").value = exp.startAt.slice(0, 16);
    document.getElementById("endAt").value = exp.endAt.slice(0, 16);

    selectedLat = exp.location?.lat ?? 27.48639;
    selectedLng = exp.location?.lng ?? -109.94083;

    initMap(selectedLat, selectedLng);
}

function initMap(lat, lng) {
    map = L.map("map").setView([lat, lng], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19
    }).addTo(map);

    marker = L.marker([lat, lng], { draggable: true }).addTo(map);

    marker.on("moveend", e => {
        selectedLat = e.target.getLatLng().lat;
        selectedLng = e.target.getLatLng().lng;
        updateCoords();
    });

    map.on("click", e => {
        selectedLat = e.latlng.lat;
        selectedLng = e.latlng.lng;
        marker.setLatLng([selectedLat, selectedLng]);
        updateCoords();
    });

    updateCoords();
}

function updateCoords() {
    document.getElementById("coords").innerText =
        `${selectedLat.toFixed(5)}, ${selectedLng.toFixed(5)}`;
}

function showSuccess() {
    document.getElementById("successModal").classList.remove("hidden");
}

function showError(message = "No se pudo actualizar la experiencia.") {
    document.getElementById("errorMessage").innerText = message;
    document.getElementById("errorModal").classList.remove("hidden");
}

document.getElementById("editForm").addEventListener("submit", async e => {
    e.preventDefault();

    const city = await obtenerCiudad(selectedLat, selectedLng);

    const dto = {
        title: document.getElementById("title").value,
        price: Number(document.getElementById("price").value),
        capacity: Number(document.getElementById("capacity").value),
        description: document.getElementById("description").value,
        startAt: document.getElementById("startAt").value,
        endAt: document.getElementById("endAt").value,
        location: JSON.stringify({
            lat: selectedLat,
            lng: selectedLng,
            city: city
        })
    };

    try {
        const res = await fetch(`http://localhost:3000/experiences/${expId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify(dto)
        });

        if (!res.ok) {
            const error = await res.json();
            showError(error.message ?? "Error al guardar los cambios.");
            return;
        }

        showSuccess();

    } catch (err) {
        console.error(err);
        showError("Error de conexión. Intenta más tarde.");
    }
});