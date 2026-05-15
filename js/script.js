/**
 * Care Plus - JavaScript Unificado e Corrigido
 */

document.addEventListener('DOMContentLoaded', function () {
    // Inicializa todas as funcionalidades
    initializeSidebar();
    initializeNavigation();
    initializeForms();
    initializeCalendar();
    initializeNotifications();
    initializeTabs();
    initializeSearch();

    console.log("Care Plus: Sistema inicializado com sucesso!");
});

/**
 * SIDEBAR - LÓGICA DE FUNCIONAMENTO (EXPANDIR/RECOLHER)
 */
function initializeSidebar() {
    const toggleBtn = document.querySelector('.toggle-btn');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const body = document.body;
    const navItems = document.querySelectorAll('.nav-item');

    if (!sidebar || !toggleBtn) {
        console.warn('Sidebar: Elementos de controle não encontrados.');
        return;
    }

    // Função principal de alternância
    function handleToggle(e) {
        if (e) e.preventDefault();

        if (window.innerWidth <= 991.98) {
            // Comportamento Mobile: Abre/Fecha lateralmente
            sidebar.classList.toggle('show');
            if (overlay) overlay.classList.toggle('show');
        } else {
            // Comportamento Desktop: Recolhe/Expande (Mini Sidebar)
            sidebar.classList.toggle('collapsed');
            body.classList.toggle('sidebar-collapsed');
        }
    }

    // Fechar tudo (usado no mobile)
    function closeAll() {
        sidebar.classList.remove('show');
        if (overlay) overlay.classList.remove('show');
    }

    // Eventos
    toggleBtn.addEventListener('click', handleToggle);

    if (overlay) {
        overlay.addEventListener('click', closeAll);
    }

    // Fechar ao clicar nos itens (apenas mobile)
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 991.98) {
                closeAll();
            }
        });
    });

    // Resetar estados ao redimensionar para evitar bugs visuais
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 992) {
            sidebar.classList.remove('show');
            if (overlay) overlay.classList.remove('show');
        } else {
            sidebar.classList.remove('collapsed');
            body.classList.remove('sidebar-collapsed');
        }
    });
}

/**
 * NAVEGAÇÃO - ESTADO ATIVO
 */
function initializeNavigation() {
    const currentPage = document.body.getAttribute('data-page');
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        // Verifica se o link corresponde à página atual
        const href = item.getAttribute('href');
        if (href && href.includes(currentPage)) {
            item.classList.add('active');
        }
    });
}

/**
 * FORMULÁRIOS - LOGIN E REGISTRO
 */
function initializeForms() {
    const loginForm = document.querySelector('#loginForm');
    const registroForm = document.querySelector('#registroForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const password = this.querySelector('input[type="password"]').value;

            if (email && password) {
                localStorage.setItem('userEmail', email);
                window.location.href = 'dashboard.html';
            }
        });
    }

    if (registroForm) {
        registroForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const password = this.querySelector('input[name="password"]').value;
            const confirmPassword = this.querySelector('input[name="confirmPassword"]').value;

            if (password !== confirmPassword) {
                alert('As senhas não coincidem');
                return;
            }

            const name = this.querySelector('input[name="name"]').value;
            localStorage.setItem('userName', name);
            localStorage.setItem('userEmail', this.querySelector('input[name="email"]').value);

            window.location.href = 'dashboard.html';
        });
    }
}

/**
 * CALENDÁRIO - AGENDAMENTO
 */
function initializeCalendar() {
    const calendarDays = document.querySelector('.calendar-days');
    if (!calendarDays) return;

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    let html = '';

    for (let i = 0; i < startingDayOfWeek; i++) {
        html += '<div class="calendar-day empty"></div>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const isAvailable = day > 10;
        const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        html += `
            <button class="calendar-day ${isAvailable ? 'available' : 'disabled'}" 
                    data-date="${date}" 
                    ${isAvailable ? '' : 'disabled'}>
                ${day}
            </button>
        `;
    }

    calendarDays.innerHTML = html;

    document.querySelectorAll('.calendar-day.available').forEach(day => {
        day.addEventListener('click', function () {
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
            this.classList.add('selected');

            const dateInput = document.querySelector('input[name="selectedDate"]');
            if (dateInput) dateInput.value = this.getAttribute('data-date');

            showTimeSlots();
        });
    });
}

function showTimeSlots() {
    const timeSlotsContainer = document.querySelector('.time-slots');
    if (!timeSlotsContainer) return;

    const horarios = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
    let html = '';

    horarios.forEach(time => {
        html += `<button class="time-slot" data-time="${time}">${time}</button>`;
    });

    timeSlotsContainer.innerHTML = html;

    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.addEventListener('click', function () {
            document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');

            const timeInput = document.querySelector('input[name="selectedTime"]');
            if (timeInput) timeInput.value = this.getAttribute('data-time');

            showConfirmation();
        });
    });
}

function showConfirmation() {
    const confirmationDiv = document.querySelector('.confirmation-section');
    if (!confirmationDiv) return;

    const date = document.querySelector('input[name="selectedDate"]')?.value;
    const time = document.querySelector('input[name="selectedTime"]')?.value;

    if (date && time) {
        confirmationDiv.style.display = 'block';
        const dateDisplay = confirmationDiv.querySelector('.confirmation-date');
        const timeDisplay = confirmationDiv.querySelector('.confirmation-time');

        if (dateDisplay) dateDisplay.textContent = formatDate(date);
        if (timeDisplay) timeDisplay.textContent = time;
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * NOTIFICAÇÕES
 */
function initializeNotifications() {
    const notificationButtons = document.querySelectorAll('.notification-action');
    notificationButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const action = this.getAttribute('data-action');
            const item = this.closest('.notification-item');
            if (!item) return;

            if (action === 'delete') {
                item.remove();
            } else if (action === 'mark-read') {
                item.classList.add('read');
            }
        });
    });
}

/**
 * ABAS (TABS)
 */
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            const targetContent = document.querySelector(`#${tabId}`);
            if (targetContent) targetContent.classList.add('active');
        });
    });
}

/**
 * BUSCA (SEARCH)
 */
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', function (e) {
        const query = e.target.value.toLowerCase();
        const items = document.querySelectorAll('[data-searchable]');
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(query) ? '' : 'none';
        });
    });
}


// =========================
// CALENDÁRIO + HORÁRIOS + RESUMO AGENDAMENTO
// =========================

document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // ELEMENTOS RESUMO
    // =========================
    const resData = document.getElementById("res-data");
    const resHorario = document.getElementById("res-horario");

    const selectedDateInput = document.getElementById("selectedDate");
    const selectedTimeInput = document.getElementById("selectedTime");

    // =========================
    // CALENDÁRIO
    // =========================
    const calendar = document.getElementById("calendar");

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    let selectedDateBtn = null;

    function updateResumoData(dateFormatted) {
        const [year, month, day] = dateFormatted.split("-");

        const formatted = `${day}/${month}/${year}`;

        if (resData) resData.textContent = formatted;
    }

    function createCalendar() {
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {

            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "btn btn-outline-primary btn-sm";
            btn.textContent = day;

            btn.addEventListener("click", () => {

                // remove seleção anterior
                if (selectedDateBtn) {
                    selectedDateBtn.classList.remove("btn-primary");
                    selectedDateBtn.classList.add("btn-outline-primary");
                }

                // ativa novo
                btn.classList.remove("btn-outline-primary");
                btn.classList.add("btn-primary");

                selectedDateBtn = btn;

                const formatted = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                if (selectedDateInput) {
                    selectedDateInput.value = formatted;
                }

                updateResumoData(formatted);
            });

            calendar.appendChild(btn);
        }
    }

    createCalendar();

    // =========================
    // HORÁRIOS
    // =========================
    const timeSlots = document.getElementById("timeSlots");

    const hours = [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
    ];

    let selectedTimeBtn = null;

    function updateResumoHorario(time) {
        if (resHorario) resHorario.textContent = time;
    }

    function renderTimes() {

        hours.forEach(time => {

            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "btn btn-outline-primary btn-sm";
            btn.textContent = time;

            btn.addEventListener("click", () => {

                // remove seleção anterior
                if (selectedTimeBtn) {
                    selectedTimeBtn.classList.remove("btn-primary");
                    selectedTimeBtn.classList.add("btn-outline-primary");
                }

                // seleciona novo
                btn.classList.remove("btn-outline-primary");
                btn.classList.add("btn-primary");

                selectedTimeBtn = btn;

                if (selectedTimeInput) {
                    selectedTimeInput.value = time;
                }

                updateResumoHorario(time);
            });

            timeSlots.appendChild(btn);
        });
    }

    renderTimes();

});


// resumo agendamento - Nome e especialidade do profissional
const profissionais = {
    1: {
        nome: "Dra. Ana Carvalho",
        especialidade: "Clínico Geral",
        preco: 150,
        local: "Clínica Central",
        rating: 4.9,
        reviews: 127
    },

    2: {
        nome: "Dr. Lucas Almeida",
        especialidade: "Cardiologia",
        preco: 220,
        local: "Hospital São Paulo",
        rating: 4.8,
        reviews: 95
    },

    3: {
        nome: "Dra. Beatriz Souza",
        especialidade: "Dermatologia",
        preco: 180,
        local: "Clínica Derma Plus",
        rating: 5.0,
        reviews: 156
    },

    4: {
        nome: "Dr. Felipe Monteiro",
        especialidade: "Oftalmologia",
        preco: 170,
        local: "Centro Oftalmológico Vision",
        rating: 4.7,
        reviews: 82
    },

    5: {
        nome: "Dra. Camila Ribeiro",
        especialidade: "Psicologia",
        preco: 120,
        local: "Instituto Mental Health",
        rating: 4.9,
        reviews: 110
    },

    6: {
        nome: "Dr. Rafael Mendes",
        especialidade: "Ortopedia",
        preco: 190,
        local: "Clínica Ortopédica São Lucas",
        rating: 4.6,
        reviews: 78
    }
};

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const p = profissionais[id];

if (p) {
    document.getElementById("res-profissional").textContent = p.nome;
    document.getElementById("res-especialidade").textContent = p.especialidade;
}