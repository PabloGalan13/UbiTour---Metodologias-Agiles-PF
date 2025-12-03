const token = checkAuthAndGetToken();
const urlParams = new URLSearchParams(window.location.search);
const expId = urlParams.get("id");

let map, marker;
let selectedLat, selectedLng;

if (!expId) {
    alert("ID no válido");
    window.location.href = "experienceList.html";
}

document.addEventListener("DOMContentLoaded", () => {
    loadExperience();

    document.getElementById("closeEditModal").onclick = () => {
        window.location.href = "experienceList.html";
    };

    document.getElementById("closeErrorModal").onclick = () => {
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

    let lat = exp.location?.lat ?? 27.48639;
    let lng = exp.location?.lng ?? -109.94083;

    selectedLat = lat;
    selectedLng = lng;

    initMap(lat, lng);
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

    map.on("click", async e => {
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
    document.getElementById("editSuccessModal").classList.remove("hidden");
}

function showError(message = "Ocurrió un error. Inténtalo de nuevo más tarde.") {
    document.getElementById("errorMessage").innerText = message;
    document.getElementById("editErrorModal").classList.remove("hidden");
}


document.getElementById("editForm").addEventListener("submit", async e => {
    e.preventDefault();

    const dto = {
        title: document.getElementById("title").value,
        price: Number(document.getElementById("price").value),
        capacity: Number(document.getElementById("capacity").value),
        description: document.getElementById("description").value,
        startAt: document.getElementById("startAt").value,
        endAt: document.getElementById("endAt").value,
        location: JSON.stringify({
            lat: selectedLat,
            lng: selectedLng
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
            showError(error.message ?? "No se pudo actualizar la experiencia.");
            return;
        }

        showSuccess();

    } catch (err) {
        console.error(err);
        showError("Error de conexión. Inténtalo más tarde.");
    }
});