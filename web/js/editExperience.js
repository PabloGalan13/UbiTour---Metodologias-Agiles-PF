const token2 = checkAuthAndGetToken();
const urlParams = new URLSearchParams(window.location.search);
const expId = urlParams.get("id");

if (!expId) {
    alert("ID no válido");
    window.location.href = "experienceList.html";
}

async function loadExperience() {
    const res = await fetch("http://localhost:3000/experiences/my", {
        headers: { Authorization: "Bearer " + token2 }
    });

    const list = await res.json();
    const exp = list.find(e => e.id === expId);

    if (!exp) {
        alert("Experiencia no encontrada.");
        return;
    }

    document.getElementById("title").value = exp.title;
    document.getElementById("price").value = exp.price;
    document.getElementById("capacity").value = exp.capacity;
    document.getElementById("description").value = exp.description;

    document.getElementById("startAt").value = exp.startAt.slice(0, 16);
    document.getElementById("endAt").value = exp.endAt.slice(0, 16);
}

document.getElementById("editForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const dto = {
        title: document.getElementById("title").value,
        price: Number(document.getElementById("price").value),
        capacity: Number(document.getElementById("capacity").value),
        description: document.getElementById("description").value,
        startAt: document.getElementById("startAt").value,
        endAt: document.getElementById("endAt").value,
    };

    const res = await fetch(`http://localhost:3000/experiences/${expId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token2
        },
        body: JSON.stringify(dto)
    });

    if (!res.ok) {
        alert("Error al guardar cambios.");
        return;
    }

    alert("Experiencia actualizada.");
    window.location.href = "experienceList.html";
});

loadExperience();