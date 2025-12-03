const token = checkAuthAndGetToken();

if (!token) {
    window.location.href = "login.html";
}

let experienceToDelete = null;


async function loadExperiences() {
    const container = document.getElementById("experienceList");

    try {
        const res = await fetch("http://localhost:3000/experiences/my", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!res.ok) throw new Error("Error al obtener experiencias");

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
                        ${new Date(exp.startAt).toLocaleDateString()} — $${exp.price}
                    </p>
                </div>

                <div class="flex gap-3">

                    <a href="editExperience.html?id=${exp.id}"
                        class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium">
                        ✏️ Editar
                    </a>

                    <button onclick="openDeleteModal('${exp.id}')"
                        class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium">
                        🗑️ Eliminar
                    </button>
                </div>

            </div>
        `).join("");

    } catch (err) {
        console.error(err);
        container.innerHTML = `
            <p class="text-red-500">Error al cargar tus experiencias.</p>
        `;
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
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        document.getElementById("confirmDeleteModal").classList.add("hidden");

        if (!res.ok) {
            showDeleteError("No se pudo eliminar la experiencia. Inténtalo más tarde.");
            return;
        }

        showDeleteSuccess();

    } catch (err) {
        console.error(err);
        showDeleteError("Error de conexión con el servidor.");
    }
};

function showDeleteError(msg) {
    document.getElementById("deleteErrorMessage").innerText = msg;
    document.getElementById("deleteErrorModal").classList.remove("hidden");
}

document.getElementById("closeErrorDeleteBtn").onclick = () => {
    document.getElementById("deleteErrorModal").classList.add("hidden");
};

function showDeleteSuccess() {
    document.getElementById("deleteSuccessModal").classList.remove("hidden");
}

document.getElementById("closeSuccessDeleteBtn").onclick = () => {
    document.getElementById("deleteSuccessModal").classList.add("hidden");
    loadExperiences();
};

loadExperiences();