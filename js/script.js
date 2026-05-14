/**
 * Care Plus - JavaScript Unificado e Corrigido
 */

document.addEventListener('DOMContentLoaded', function() {
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
        loginForm.addEventListener('submit', function(e) {
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
        registroForm.addEventListener('submit', function(e) {
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
        day.addEventListener('click', function() {
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
        slot.addEventListener('click', function() {
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
        btn.addEventListener('click', function() {
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
        button.addEventListener('click', function() {
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

    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        const items = document.querySelectorAll('[data-searchable]');
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(query) ? '' : 'none';
        });
    });
}
