const token = checkAuthAndGetToken();

if (!token) window.location.href = "login.html";

let experienceToDelete = null;
let experienceToActivate = null;

async function loadExperiences() {
    const container = document.getElementById("experienceList");

    try {
        const res = await fetch("http://localhost:3000/experiences/my", {
            headers: { "Authorization": "Bearer " + token }
        });

        if (!res.ok) throw new Error("Error al obtener experiencias");

        let experiences = await res.json();
        
        const filterName = document.getElementById("filterName")?.value.toLowerCase() || "";
        const filterCity = document.getElementById("filterCity")?.value.toLowerCase() || "";
        const filterStatus = document.getElementById("filterStatus")?.value || "all";

        experiences = experiences.filter(exp => {
            const matchName = exp.title.toLowerCase().includes(filterName);
            const matchCity = exp.location?.city?.toLowerCase().includes(filterCity);

            let matchStatus = true;
            if (filterStatus === "active") matchStatus = exp.isActive === true;
            if (filterStatus === "inactive") matchStatus = exp.isActive === false;

            return matchName && matchCity && matchStatus;
        });

        if (experiences.length === 0) {
            container.innerHTML = `<p class="text-gray-500 text-sm">No se encontraron experiencias.</p>`;
            return;
        }

        container.innerHTML = experiences.map(exp => `
            <div class="bg-white p-5 rounded-lg shadow border flex justify-between items-center">

                <div>
                    <h2 class="text-lg font-semibold text-gray-800">${exp.title}</h2>
                    <p class="text-gray-600 text-sm">
                        ${new Date(exp.startAt).toLocaleDateString()} — $${exp.price}
                    </p>
                    <p class="text-xs text-gray-500 mt-1">Ciudad: ${exp.location.city}</p>
                    ${exp.isActive
                        ? `<span class="text-green-600 text-xs font-semibold">Activa</span>`
                        : `<span class="text-red-600 text-xs font-semibold">Inactiva</span>`}
                </div>

                <div class="flex gap-3">

                    <a href="editExperience.html?id=${exp.id}"
                        class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium">
                        ✏️ Editar
                    </a>

                    ${exp.isActive
                        ? `
                            <button onclick="openDeleteModal('${exp.id}')"
                                class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium">
                                🗑️ Desactivar
                            </button>
                          `
                        : `
                            <button onclick="openActivateModal('${exp.id}')"
                                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium">
                                ✔ Activar
                            </button>
                          `}
                </div>
            </div>
        `).join("");

    } catch (err) {
        console.error(err);
        container.innerHTML = `<p class="text-red-500">Error al cargar las experiencias.</p>`;
    }
}

function openDeleteModal(id) {
    experienceToDelete = id;
    document.getElementById("confirmDeleteModal").classList.remove("hidden");
}

document.getElementById("cancelDeleteBtn").onclick = () => {
    document.getElementById("confirmDeleteModal").classList.add("hidden");
    experienceToDelete = null;
};

document.getElementById("confirmDeleteBtn").onclick = async () => {
    try {
        const res = await fetch(`http://localhost:3000/experiences/${experienceToDelete}`, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token }
        });

        document.getElementById("confirmDeleteModal").classList.add("hidden");

        if (!res.ok) return showError("No se pudo desactivar la experiencia.");

        showSuccess();
    } catch {
        showError("Error de conexión con el servidor.");
    }
};

function openActivateModal(id) {
    experienceToActivate = id;
    document.getElementById("confirmActivateModal").classList.remove("hidden");
}

document.getElementById("confirmActivateBtn").onclick = async () => {
    try {
        const res = await fetch(`http://localhost:3000/experiences/${experienceToActivate}/activate`, {
            method: "PATCH",
            headers: { "Authorization": "Bearer " + token }
        });

        document.getElementById("confirmActivateModal").classList.add("hidden");

        if (!res.ok) return showError("No se pudo activar la experiencia.");

        showSuccess();
    } catch {
        showError("Error al activar.");
    }
};

function showError(msg) {
    document.getElementById("deleteErrorMessage").innerText = msg;
    document.getElementById("deleteErrorModal").classList.remove("hidden");
}

document.getElementById("closeErrorDeleteBtn").onclick = () => {
    document.getElementById("deleteErrorModal").classList.add("hidden");
};

function showSuccess() {
    document.getElementById("deleteSuccessModal").classList.remove("hidden");
}

document.getElementById("closeSuccessDeleteBtn").onclick = () => {
    document.getElementById("deleteSuccessModal").classList.add("hidden");
    loadExperiences();
};

document.getElementById("filterBtn").addEventListener("click", loadExperiences);

loadExperiences();