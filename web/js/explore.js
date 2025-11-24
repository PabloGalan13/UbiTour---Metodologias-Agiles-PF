async function loadExperiences() {
    const urlParams = new URLSearchParams();

    const city = document.getElementById("city").value.trim();
    const minPrice = document.getElementById("minPrice").value.trim();
    const maxPrice = document.getElementById("maxPrice").value.trim();
    const date = document.getElementById("date").value.trim();

    if (city) urlParams.append("location", city);
    if (minPrice) urlParams.append("minPrice", minPrice);
    if (maxPrice) urlParams.append("maxPrice", maxPrice);
    if (date) urlParams.append("date", date);

    let endpoint = "http://localhost:3000/experiences";

    // Si hay filtros → usar /filter
    if ([city, minPrice, maxPrice, date].some(v => v !== "")) {
        endpoint += "/filter?" + urlParams.toString();
    }

    console.log("Consultando:", endpoint);

    const res = await fetch(endpoint);
    const data = await res.json();

    renderExperiences(data);
}

function renderExperiences(experiences) {
    const container = document.getElementById("results");
    container.innerHTML = "";

    if (!experiences.length) {
        container.innerHTML = "<p>No se encontraron experiencias.</p>";
        return;
    }

    experiences.forEach(exp => {
        const card = `
        <div class="card">
            <img src="${exp.photos[0]}" class="card-img">
            <div class="card-body">
                <h3>${exp.title}</h3>
                <p>${exp.location.city}, España</p>
                <p><strong>${exp.price}€ / persona</strong></p>
                <button class="btn-details">Ver detalles</button>
            </div>
        </div>`;
        container.innerHTML += card;
    });
}

// Cargar todas al iniciar
window.onload = loadExperiences;