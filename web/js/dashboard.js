const token = checkAuthAndGetToken();
if (!token) window.location.href = "login.html";

async function fetchUser() {
    try {
        const res = await fetch("http://localhost:3000/auth/me", {
            headers: { Authorization: "Bearer " + token }
        });

        if (!res.ok) throw new Error();

        const user = await res.json();
        window.currentUser = user;

        let providerOptions = "";

        if (user.role === "PROVIDER") {
            providerOptions = `
                <div class="mt-6 border-t pt-4">
                    <p class="text-sm font-semibold text-gray-700 mb-2">Opciones de Proveedor:</p>

                    <a href="createExperience.html" 
                       class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 
                              text-white px-4 py-2 rounded-lg text-sm shadow-md">
                        ➕ Registrar Nueva Experiencia
                    </a>

                    <a href="experienceList.html"
                       class="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 
                              text-white px-4 py-2 rounded-lg text-sm shadow-md">
                        📋 Administrar Mis Experiencias
                    </a>
                </div>`;
        }

        document.getElementById("userBox").innerHTML = `
            <p class="mb-4">
                <strong>Nombre:</strong> ${user.name}<br>
                <strong>Email:</strong> ${user.email}<br>
                <strong>Rol:</strong> <span class="font-bold text-blue-800">${user.role}</span>
            </p>
            ${providerOptions}
        `;
    } catch {
        document.getElementById("userBox").innerHTML = "Error al cargar usuario.";
    }
}

fetchUser();

const tabPerfil = document.getElementById("tabPerfil");
const tabReservas = document.getElementById("tabReservas");

const perfilSection = document.getElementById("perfilSection");
const reservasSection = document.getElementById("reservasSection");

tabPerfil.onclick = () => {
    tabPerfil.classList.add("border-b-2", "border-blue-600", "text-blue-600");
    tabReservas.classList.remove("border-b-2", "border-blue-600", "text-blue-600");

    perfilSection.classList.remove("hidden");
    reservasSection.classList.add("hidden");
};

tabReservas.onclick = () => {
    tabReservas.classList.add("border-b-2", "border-blue-600", "text-blue-600");
    tabPerfil.classList.remove("border-b-2", "border-blue-600", "text-blue-600");

    perfilSection.classList.add("hidden");
    reservasSection.classList.remove("hidden");

    loadReservas();
};

let allReservations = [];

async function loadReservas() {
    try {
        const res = await fetch("http://localhost:3000/reservations/my", {
            headers: { Authorization: "Bearer " + token }
        });

        allReservations = await res.json();

        cargarExperienciasEnFiltro();
        renderReservas(allReservations);

    } catch (err) {
        console.error(err);
    }
}

function cargarExperienciasEnFiltro() {
    const expSelect = document.getElementById("filtroExperiencia");
    expSelect.innerHTML = `<option value="all">Todas las experiencias</option>`;

    const experienciasUnicas = [...new Set(allReservations.map(r => r.experience.title))];

    experienciasUnicas.forEach(title => {
        expSelect.innerHTML += `<option value="${title}">${title}</option>`;
    });
}

document.getElementById("btnAplicarFiltros").onclick = () => {
    const experiencia = document.getElementById("filtroExperiencia").value;
    const estado = document.getElementById("filtroEstado").value;
    const cliente = document.getElementById("filtroCliente").value.toLowerCase();

    let filtradas = allReservations.filter(r => {

        if (experiencia !== "all" && r.experience.title !== experiencia) return false;
        if (estado !== "ALL" && r.status !== estado) return false;
        if (cliente && !r.user.name.toLowerCase().includes(cliente)) return false;

        return true;
    });

    renderReservas(filtradas);
};

function renderReservas(reservas) {
    const container = document.getElementById("reservasList");
    container.innerHTML = "";

    if (reservas.length === 0) {
        container.innerHTML = `<p class="text-gray-500">No se encontraron reservas con estos filtros.</p>`;
        return;
    }

    const grouped = reservas.reduce((acc, r) => {
        const title = r.experience.title;
        if (!acc[title]) acc[title] = [];
        acc[title].push(r);
        return acc;
    }, {});

    Object.keys(grouped).forEach(title => {
        container.innerHTML += `
            <div class="bg-purple-50 p-5 rounded-xl border border-purple-300 mb-6">
                <h3 class="text-lg font-semibold text-purple-700 mb-3">${title}</h3>

                ${grouped[title].map(r => `
                    <div class="bg-white border rounded-lg p-4 shadow mb-3">
                        <p><strong>Cliente:</strong> ${r.user.name}</p>
                        <p><strong>Fecha:</strong> ${new Date(r.createdAt).toLocaleDateString()}</p>
                        <p><strong>Personas:</strong> ${r.qty}</p>
                        <p><strong>Total:</strong> $${r.amountTotal}</p>
                        <p><strong>Estado:</strong> 
                            <span class="px-2 py-1 rounded text-white text-xs 
                                ${r.status === "PAID" ? "bg-green-600" : "bg-yellow-600"}">
                                ${r.status}
                            </span>
                        </p>
                    </div>
                `).join("")}
            </div>
        `;
    });
}