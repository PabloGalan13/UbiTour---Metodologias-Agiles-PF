// Obtiene token
const token = checkAuthAndGetToken();

if (!token) {
    window.location.href = "login.html";
}

async function fetchUser() {
    try {
        const res = await fetch("http://localhost:3000/auth/me", {
            headers: { Authorization: "Bearer " + token }
        });

        if (!res.ok) throw new Error();

        const user = await res.json();

        let providerOptions = "";

        if (user.role === "PROVIDER") {
            providerOptions = `
                <div class="mt-6 border-t pt-4 border-gray-200">
                    <p class="text-sm font-semibold text-gray-700 mb-2">Opciones de Proveedor:</p>

                    <a href="createExperience.html"
                        class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md">
                        ➕ Registrar Nueva Experiencia
                    </a>

                    <a href="experienceList.html"
                        class="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md">
                        📋 Administrar Mis Experiencias
                    </a>
                </div>
            `;
        }

        document.getElementById("userBox").innerHTML = `
            <p class="mb-4">
                <strong>Nombre:</strong> ${user.name ?? "Sin nombre"}<br>
                <strong>Email:</strong> ${user.email}<br>
                <strong>Rol:</strong> <span class="font-bold text-blue-800">${user.role}</span>
            </p>
            ${providerOptions}
        `;

    } catch {
        document.getElementById("userBox").innerHTML =
            "Hubo un problema al cargar tus datos.";
    }
}

fetchUser();

const tabPerfil = document.getElementById("tabPerfil");
const tabReservas = document.getElementById("tabReservas");

const perfilSection = document.getElementById("perfilSection");
const reservasSection = document.getElementById("reservasSection");

tabPerfil.addEventListener("click", () => {
    tabPerfil.classList.add("border-b-2", "border-blue-600", "text-blue-600");
    tabReservas.classList.remove("border-b-2", "border-blue-600", "text-blue-600");

    perfilSection.classList.remove("hidden");
    reservasSection.classList.add("hidden");
});

tabReservas.addEventListener("click", () => {
    tabReservas.classList.add("border-b-2", "border-blue-600", "text-blue-600");
    tabPerfil.classList.remove("border-b-2", "border-blue-600", "text-blue-600");

    perfilSection.classList.add("hidden");
    reservasSection.classList.remove("hidden");

    loadMyReservations();
});

async function loadMyReservations() {
    const container = document.getElementById("reservationsBox");
    container.innerHTML = "Cargando reservas...";

    try {
        const res = await fetch("http://localhost:3000/reservations/my", {
            headers: { Authorization: "Bearer " + token }
        });

        if (!res.ok) throw new Error("Error al obtener las reservas.");

        const reservations = await res.json();

        if (reservations.length === 0) {
            container.innerHTML = `
                <p class="text-gray-500 text-sm">No tienes reservas todavía.</p>
            `;
            return;
        }

        const grouped = reservations.reduce((acc, r) => {
            const exp = r.experience.title;
            if (!acc[exp]) acc[exp] = [];
            acc[exp].push(r);
            return acc;
        }, {});

        container.innerHTML = "";

        Object.keys(grouped).forEach(title => {
            const groupHtml = `
                <div class="bg-purple-50 border border-purple-300 rounded-xl p-5 mb-8 shadow-sm">
                    <h2 class="text-xl font-semibold text-purple-700 mb-3">${title}</h2>

                    <div class="space-y-4">
                        ${grouped[title]
                            .map(
                                r => `
                            <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
                                <p><strong>Cliente:</strong> ${r.user.name}</p>
                                <p><strong>Fecha:</strong> ${new Date(r.createdAt).toLocaleDateString()}</p>
                                <p><strong>Personas:</strong> ${r.qty}</p>
                                <p><strong>Total:</strong> $${r.amountTotal}</p>
                                <p><strong>Estado:</strong> 
                                    <span class="px-2 py-1 rounded text-white text-xs ${
                                        r.status === "PAID" ? "bg-green-600" : "bg-yellow-600"
                                    }">
                                        ${r.status}
                                    </span>
                                </p>
                            </div>
                        `
                            )
                            .join("")}
                    </div>
                </div>
            `;

            container.innerHTML += groupHtml;
        });
    } catch (err) {
        console.error(err);
        container.innerHTML =
            `<p class="text-red-600">Hubo un error al cargar tus reservas.</p>`;
    }
}