const token = checkAuthAndGetToken();

if (!token) {
    window.location.href = "login.html";
}

async function loadExperiences() {
    const container = document.getElementById("experienceList");

    try {
        console.log("TOKEN:", token);

        const res = await fetch("http://localhost:3000/experiences/my", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!res.ok) throw new Error("Error en la petición");

        const experiences = await res.json();

        if (experiences.length === 0) {
            container.innerHTML = `
                <p class="text-gray-500 text-sm">Aún no registras experiencias.</p>
            `;
            return;
        }

        container.innerHTML = experiences.map(exp => `
            <div class="bg-white p-5 rounded-lg shadow border flex justify-between items-center">

                <div>
                    <h2 class="text-lg font-semibold text-gray-800">${exp.title}</h2>
                    <p class="text-gray-600 text-sm">
                        ${new Date(exp.startAt).toLocaleDateString()} — 
                        $${exp.price}
                    </p>
                </div>

                <div class="flex gap-3">

                    <a href="editExperience.html?id=${exp.id}"
                        class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium">
                        ✏️ Editar
                    </a>

                    <button onclick="deleteExperience('${exp.id}')"
                        class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium">
                        🗑️ Eliminar
                    </button>
                </div>

            </div>
        `).join("");

    } catch (err) {
        container.innerHTML = `
            <p class="text-red-500">Error al cargar tus experiencias.</p>
        `;
        console.error(err);
    }
}

async function deleteExperience(id) {
    const confirmDelete = confirm("¿Seguro que deseas eliminar esta experiencia?");
    if (!confirmDelete) return;

    try {
        const res = await fetch(`http://localhost:3000/experiences/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!res.ok) throw new Error();

        alert("Experiencia eliminada correctamente.");
        loadExperiences();

    } catch {
        alert("No se pudo eliminar la experiencia.");
    }
}

loadExperiences();