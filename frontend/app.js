const DB_KEYS = {
    clients: "autocheck.clients",
    vehicles: "autocheck.vehicles",
    serviceOrders: "autocheck.serviceOrders",
    osSeq: "autocheck.osSequence",
    theme: "autocheck.theme"
};

function getSavedTheme() {
    return localStorage.getItem(DB_KEYS.theme) || "light";
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(DB_KEYS.theme, theme);
    syncThemeToggleText();
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme") || getSavedTheme();
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
}

function syncThemeToggleText() {
    const isDark = (document.documentElement.getAttribute("data-theme") || "light") === "dark";
    const buttons = document.querySelectorAll("[data-theme-toggle]");
    buttons.forEach((button) => {
        button.textContent = isDark ? "Modo Claro" : "Modo Escuro";
        button.setAttribute("aria-label", isDark ? "Ativar modo claro" : "Ativar modo escuro");
    });
}

function initTheme() {
    applyTheme(getSavedTheme());
}

function getData(key) {
    return JSON.parse(localStorage.getItem(key) || "[]");
}

function setData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function showMessage(targetId, text, type) {
    const target = document.getElementById(targetId);
    if (!target) return;
    target.className = `msg ${type}`;
    target.textContent = text;
}

function formatPlate(plate) {
    return plate.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function previewNextOsNumber() {
    const year = new Date().getFullYear();
    const seq = Number(localStorage.getItem(DB_KEYS.osSeq) || "0") + 1;
    return `OS-${year}-${String(seq).padStart(6, "0")}`;
}

function consumeNextOsNumber() {
    const year = new Date().getFullYear();
    const seq = Number(localStorage.getItem(DB_KEYS.osSeq) || "0") + 1;
    localStorage.setItem(DB_KEYS.osSeq, String(seq));
    return `OS-${year}-${String(seq).padStart(6, "0")}`;
}

function buildTopNav(activePage = "home") {
    const isActive = (page) => (page === activePage ? "active" : "");
    return `
    <div class="top-actions">
                        <div class="top-actions-left">
                                <a class="btn ${isActive("home")}" href="../index.html">Inicio</a>
                                <a class="btn ${isActive("cliente")}" href="cadastro-cliente.html">Cliente</a>
                                <a class="btn ${isActive("veiculo")}" href="cadastro-veiculo.html">Veiculo</a>
                                <a class="btn ${isActive("os")}" href="abrir-os.html">Abrir OS</a>
                        </div>
                        <button class="btn ghost" type="button" data-theme-toggle onclick="toggleTheme()">Modo Escuro</button>
    </div>
  `;
}

function getClientNameById(clientId) {
    const client = getData(DB_KEYS.clients).find(c => String(c.id) === String(clientId));
    return client ? client.nome : "Cliente nao encontrado";
}

function getVehicleLabelById(vehicleId) {
    const vehicle = getData(DB_KEYS.vehicles).find(v => String(v.id) === String(vehicleId));
    return vehicle ? `${vehicle.placa} - ${vehicle.marca} ${vehicle.modelo}` : "Veiculo nao encontrado";
}

// Evita que textos digitados pelo usuario sejam interpretados como HTML (protecao contra XSS)
function escapeHtml(valor) {
    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function renderClientsList(targetId) {
    const ul = document.getElementById(targetId);
    if (!ul) return;

    const clients = getData(DB_KEYS.clients);
    ul.innerHTML = clients.length
        ? clients.map(c => `<li><strong>${escapeHtml(c.nome)}</strong><br>${escapeHtml(c.telefone)} | ${escapeHtml(c.email || "sem email")}</li>`).join("")
        : "<li>Nenhum cliente cadastrado.</li>";
}

function renderVehiclesList(targetId) {
    const ul = document.getElementById(targetId);
    if (!ul) return;

    const vehicles = getData(DB_KEYS.vehicles);
    ul.innerHTML = vehicles.length
        ? vehicles.map(v => `
                        <li>
                            <strong>${escapeHtml(v.placa)}</strong> - ${escapeHtml(v.marca)} ${escapeHtml(v.modelo)} (${escapeHtml(v.ano)})<br>
                            Cliente: ${escapeHtml(getClientNameById(v.clienteId))} | KM: ${escapeHtml(v.km)}
                        </li>
                    `).join("")
        : "<li>Nenhum veiculo cadastrado.</li>";
}

function populateClientsSelect(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;

    const clients = getData(DB_KEYS.clients);
    select.innerHTML = "<option value=''>Selecione...</option>" +
        clients.map(c => `<option value='${escapeHtml(c.id)}'>${escapeHtml(c.nome)} (ID ${escapeHtml(c.id)})</option>`).join("");
}

function populateVehiclesSelect(selectId, clientId) {
    const select = document.getElementById(selectId);
    if (!select) return;

    const vehicles = getData(DB_KEYS.vehicles)
        .filter(v => !clientId || String(v.clienteId) === String(clientId));

    select.innerHTML = "<option value=''>Selecione...</option>" +
        vehicles.map(v => `<option value='${escapeHtml(v.id)}'>${escapeHtml(v.placa)} - ${escapeHtml(v.marca)} ${escapeHtml(v.modelo)}</option>`).join("");
}

function getActiveOrdersForVehicle(vehicleId) {
    const openStatuses = [
        "Aguardando diagnostico",
        "Em diagnostico",
        "Aguardando aprovacao",
        "Em reparo"
    ];

    return getData(DB_KEYS.serviceOrders).filter(
        os => String(os.veiculoId) === String(vehicleId) && openStatuses.includes(os.status)
    );
}

function renderOrdersList(targetId) {
    const ul = document.getElementById(targetId);
    if (!ul) return;

    const orders = getData(DB_KEYS.serviceOrders);
    ul.innerHTML = orders.length
        ? orders.map(os => `
                        <li>
                            <strong>${escapeHtml(os.numeroOs)}</strong><br>
                            Status: ${escapeHtml(os.status)}<br>
                            Cliente: ${escapeHtml(getClientNameById(os.clienteId))}<br>
                            Veiculo: ${escapeHtml(getVehicleLabelById(os.veiculoId))}
                        </li>
                    `).join("")
        : "<li>Nenhuma OS aberta.</li>";
}
