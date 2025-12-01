async function loadExperiences(filters = {}) {
    const urlParams = new URLSearchParams();

    if (filters.city) urlParams.append("city", filters.city);
    if (filters.minPrice) urlParams.append("minPrice", filters.minPrice);
    if (filters.maxPrice) urlParams.append("maxPrice", filters.maxPrice);
    if (filters.date) urlParams.append("date", filters.date);

    let endpoint = "http://localhost:3000/experiences";

    if (Array.from(urlParams).length > 0) {
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
            <img src="${exp.photos?.[0] || ''}" class="card-img">
            <div class="card-body">
                <h3>${exp.title}</h3>
                <p>${exp.location?.city ?? ''}</p>
                <p><strong>${exp.price}€ / persona</strong></p>
                <button class="btn-details" onclick="verDetalles('${exp.id}')">Ver detalles</button>
            </div>
        </div>`;
        container.innerHTML += card;
    });
}

function verDetalles(id) {
    window.location.href = `experience.html?id=${id}`;
}

document.getElementById("btnFiltrar").addEventListener("click", () => {
    const filters = {
        city: document.getElementById("city").value.trim(),
        minPrice: document.getElementById("minPrice").value.trim(),
        maxPrice: document.getElementById("maxPrice").value.trim(),
        date: document.getElementById("date").value.trim()
    };

    loadExperiences(filters);
});

window.onload = () => loadExperiences();