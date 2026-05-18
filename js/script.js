/**
 * Care Plus — JavaScript Unificado
 * Responsável por: Sidebar, Navegação, Formulários, Calendário,
 *                  Notificações, Abas, Busca, Toggles e Bottom Nav.
 */

document.addEventListener('DOMContentLoaded', function () {
    initializeSidebar();
    initializeNavigation();
    initializeMobileBottomNav();
    initializeForms();
    initializePasswordToggle();
    initializeCalendar();
    initializeNotifications();
    initializeTabs();
    initializeToggleSwitches();
    initializeSearch();
    loadProfissionalData();
    initializeVacinaForm();
    loadVacinas();
});

/* ============================================================
   SIDEBAR
   ============================================================ */

function initializeSidebar() {
    const toggleBtn  = document.querySelector('.toggle-btn');
    const sidebar    = document.querySelector('.sidebar');
    const overlay    = document.querySelector('.sidebar-overlay');
    const body       = document.body;
    const navItems   = document.querySelectorAll('.nav-item');

    if (!sidebar || !toggleBtn) return;

    function isMobile() { return window.innerWidth <= 991.98; }

    function handleToggle(e) {
        if (e) e.preventDefault();

        if (isMobile()) {
            sidebar.classList.toggle('show');
            if (overlay) overlay.classList.toggle('show');
        } else {
            sidebar.classList.toggle('collapsed');
            body.classList.toggle('sidebar-collapsed');
        }
    }

    function closeAll() {
        sidebar.classList.remove('show');
        if (overlay) overlay.classList.remove('show');
    }

    toggleBtn.addEventListener('click', handleToggle);

    if (overlay) overlay.addEventListener('click', closeAll);

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (isMobile()) closeAll();
        });
    });

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

/* ============================================================
   NAVEGAÇÃO ATIVA (Sidebar)
   ============================================================ */

function initializeNavigation() {
    const currentPage = document.body.getAttribute('data-page');
    if (!currentPage) return;

    document.querySelectorAll('.nav-item').forEach(item => {
        const href = item.getAttribute('href') || '';
        // Extrai o nome do arquivo sem extensão ou query
        const filename = href.split('/').pop().split('?')[0].replace('.html', '');
        if (filename === currentPage) {
            item.classList.add('active');
        }
    });
}

/* ============================================================
   MOBILE BOTTOM NAV ATIVA
   ============================================================ */

function initializeMobileBottomNav() {
    const currentPage = document.body.getAttribute('data-page');
    if (!currentPage) return;

    document.querySelectorAll('.mobile-nav-item').forEach(item => {
        const pageLink = item.getAttribute('data-page-link');
        if (pageLink === currentPage) {
            item.classList.add('active');
        }
    });
}

/* ============================================================
   FORMULÁRIOS — Login e Registro
   ============================================================ */

function initializeForms() {
    const loginForm    = document.querySelector('#loginForm');
    const registroForm = document.querySelector('#registroForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email    = this.querySelector('#email, [name="email"]');
            const password = this.querySelector('#password, [name="password"]');
            const btn      = this.querySelector('button[type="submit"]');

            if (!email || !password) return;

            if (email.value && password.value) {
                // Feedback visual de loading
                if (btn) {
                    btn.disabled  = true;
                    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando…';
                }

                localStorage.setItem('userEmail', email.value);
                localStorage.setItem('userLoggedIn', 'true');

                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 600);
            }
        });
    }

    if (registroForm) {
        registroForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name            = this.querySelector('input[name="name"]');
            const email           = this.querySelector('input[name="email"]');
            const password        = this.querySelector('input[name="password"]');
            const confirmPassword = this.querySelector('input[name="confirmPassword"]');
            const btn             = this.querySelector('button[type="submit"]');

            if (password && confirmPassword && password.value !== confirmPassword.value) {
                confirmPassword.style.borderColor = '#ef4444';
                confirmPassword.focus();
                // Inline error sem alert nativo
                showFieldError(confirmPassword, 'As senhas não coincidem.');
                return;
            }

            if (btn) {
                btn.disabled  = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Criando conta…';
            }

            if (name)  localStorage.setItem('userName', name.value);
            if (email) localStorage.setItem('userEmail', email.value);
            localStorage.setItem('userLoggedIn', 'true');

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 700);
        });
    }
}

function showFieldError(input, message) {
    // Remove erro anterior
    const existing = input.parentElement.querySelector('.field-error');
    if (existing) existing.remove();

    const err = document.createElement('p');
    err.className   = 'field-error';
    err.textContent = message;
    err.style.cssText = 'color:#ef4444;font-size:12px;margin:4px 0 0;';
    input.parentElement.appendChild(err);

    input.addEventListener('input', () => err.remove(), { once: true });
}

/* ============================================================
   TOGGLE DE SENHA (mostrar / ocultar)
   ============================================================ */

function initializePasswordToggle() {
    document.querySelectorAll('.input-toggle-pw').forEach(btn => {
        btn.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const input    = document.getElementById(targetId);
            if (!input) return;

            const isPassword = input.type === 'password';
            input.type       = isPassword ? 'text' : 'password';

            const icon = this.querySelector('i');
            if (icon) {
                icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
            }
            this.setAttribute('title', isPassword ? 'Ocultar senha' : 'Mostrar senha');
        });
    });
}

/* ============================================================
   CALENDÁRIO — Agendamento
   ============================================================ */

function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;

    const today   = new Date();
    const year    = today.getFullYear();
    const month   = today.getMonth();

    // Título do mês
    const titleEl = document.getElementById('calendarTitle');
    if (titleEl) {
        titleEl.textContent = today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        titleEl.style.textTransform = 'capitalize';
    }

    const firstDay      = new Date(year, month, 1).getDay();
    const daysInMonth   = new Date(year, month + 1, 0).getDate();
    const todayDate     = today.getDate();

    let html = '';

    // Células vazias antes do primeiro dia
    for (let i = 0; i < firstDay; i++) {
        html += '<button class="calendar-day empty" disabled aria-hidden="true"></button>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const isAvailable = day > todayDate; // apenas datas futuras
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = (day === todayDate);
        const extraClass = !isAvailable ? 'disabled' : '';
        const todayAttr  = isToday ? 'style="font-weight:800;color:var(--primary);"' : '';

        html += `
          <button class="calendar-day ${extraClass}"
            data-date="${dateStr}"
            ${!isAvailable ? 'disabled' : ''}
            aria-label="${dateStr}"
            ${todayAttr}>
            ${day}
          </button>`;
    }

    calendarEl.innerHTML = html;

    calendarEl.querySelectorAll('.calendar-day:not(:disabled):not(.empty)').forEach(btn => {
        btn.addEventListener('click', function () {
            calendarEl.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
            this.classList.add('selected');

            const dateInput = document.getElementById('selectedDate');
            if (dateInput) dateInput.value = this.getAttribute('data-date');

            updateResumoData(this.getAttribute('data-date'));
            renderTimeSlots();
        });
    });
}

function renderTimeSlots() {
    const container = document.getElementById('timeSlots');
    if (!container) return;

    const horarios = [
        '08:00','08:30','09:00','09:30','10:00','10:30',
        '14:00','14:30','15:00','15:30','16:00','16:30'
    ];

    container.innerHTML = horarios.map(time =>
        `<button class="time-slot" data-time="${time}">${time}</button>`
    ).join('');

    container.querySelectorAll('.time-slot').forEach(slot => {
        slot.addEventListener('click', function () {
            container.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');

            const timeInput = document.getElementById('selectedTime');
            if (timeInput) timeInput.value = this.getAttribute('data-time');

            updateResumoHorario(this.getAttribute('data-time'));
        });
    });
}

function updateResumoData(dateStr) {
    const el = document.getElementById('res-data');
    if (!el || !dateStr) return;
    const [y, m, d] = dateStr.split('-');
    el.textContent = `${d}/${m}/${y}`;
}

function updateResumoHorario(time) {
    const el = document.getElementById('res-horario');
    if (el) el.textContent = time;
}

/* ============================================================
   NOTIFICAÇÕES
   ============================================================ */

function initializeNotifications() {
    document.addEventListener('click', function (e) {
        const btn  = e.target.closest('[data-action]');
        if (!btn)  return;

        const action = btn.getAttribute('data-action');
        const item   = btn.closest('.notification-item');
        if (!item)   return;

        if (action === 'delete') {
            item.style.transition = 'opacity .25s ease, transform .25s ease';
            item.style.opacity    = '0';
            item.style.transform  = 'translateX(20px)';
            setTimeout(() => item.remove(), 260);

        } else if (action === 'mark-read') {
            item.classList.remove('unread', 'type-success', 'type-warning', 'type-danger', 'type-info');
            item.style.opacity = '0.65';
            btn.remove();
        }
    });

    // "Marcar todas como lidas"
    const markAllBtn = document.querySelector('.btn-outline.btn-sm');
    if (markAllBtn && markAllBtn.textContent.includes('lidas')) {
        markAllBtn.addEventListener('click', () => {
            document.querySelectorAll('.notification-item.unread').forEach(item => {
                item.classList.remove('unread', 'type-success', 'type-warning', 'type-danger', 'type-info');
                item.style.opacity = '0.65';
                const checkBtn = item.querySelector('[data-action="mark-read"]');
                if (checkBtn) checkBtn.remove();
            });
        });
    }
}

/* ============================================================
   ABAS (TABS)
   ============================================================ */

function initializeTabs() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function () {
            const tabId  = this.getAttribute('data-tab');
            const parent = this.closest('.card') || document;

            parent.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            this.classList.add('active');
            const target = parent.querySelector(`#${tabId}`);
            if (target) target.classList.add('active');
        });
    });
}

/* ============================================================
   TOGGLE SWITCHES (Configurações)
   ============================================================ */

function initializeToggleSwitches() {
    document.querySelectorAll('.toggle-switch').forEach(toggle => {
        toggle.addEventListener('click', function () {
            const isActive = this.classList.toggle('active');
            this.setAttribute('aria-checked', String(isActive));
        });

        // Acessibilidade: suporte a teclado
        toggle.addEventListener('keydown', function (e) {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

/* ============================================================
   BUSCA (Profissionais)
   ============================================================ */

function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase().trim();
        document.querySelectorAll('[data-searchable]').forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = (!query || text.includes(query)) ? '' : 'none';
        });
    });
}

/* ============================================================
   DADOS DO PROFISSIONAL NO RESUMO DE AGENDAMENTO
   ============================================================ */

const profissionais = {
    1: { nome: 'Dra. Ana Carvalho',   especialidade: 'Clínico Geral',  preco: 150 },
    2: { nome: 'Dr. Lucas Almeida',   especialidade: 'Cardiologia',    preco: 220 },
    3: { nome: 'Dra. Beatriz Souza',  especialidade: 'Dermatologia',   preco: 180 },
    4: { nome: 'Dr. Felipe Monteiro', especialidade: 'Oftalmologia',   preco: 170 },
    5: { nome: 'Dra. Camila Ribeiro', especialidade: 'Psicologia',     preco: 120 },
    6: { nome: 'Dr. Rafael Mendes',   especialidade: 'Ortopedia',      preco: 190 }
};

function loadProfissionalData() {
    const params = new URLSearchParams(window.location.search);
    const id     = params.get('id');
    const p      = profissionais[id];
    if (!p) return;

    const nomeEl = document.getElementById('res-profissional');
    const espEl  = document.getElementById('res-especialidade');
    if (nomeEl) nomeEl.textContent = p.nome;
    if (espEl)  espEl.textContent  = p.especialidade;
}

/* ============================================================
   VACINAS — Registro e Listagem
   ============================================================ */

/**
 * Retorna todas as vacinas salvas no localStorage.
 * @returns {Array}
 */
function getVacinas() {
    try {
        return JSON.parse(localStorage.getItem('careplus_vacinas') || '[]');
    } catch {
        return [];
    }
}

/**
 * Salva o array de vacinas no localStorage.
 * @param {Array} vacinas
 */
function saveVacinas(vacinas) {
    localStorage.setItem('careplus_vacinas', JSON.stringify(vacinas));
}

/**
 * Formata uma string ISO (YYYY-MM-DD) para DD/MM/YYYY.
 * @param {string} iso
 * @returns {string}
 */
function formatDate(iso) {
    if (!iso) return '—';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
}

/**
 * Retorna o HTML do badge para um status de vacina.
 * @param {string} status
 * @returns {string}
 */
function vacinaBadge(status) {
    const map = {
        completa: { cls: 'badge-success', icon: 'fa-check-circle',      label: 'Completa' },
        pendente: { cls: 'badge-warning', icon: 'fa-clock',             label: 'Pendente' },
        vencida:  { cls: 'badge-danger',  icon: 'fa-exclamation-circle', label: 'Vencida'  },
    };
    const s = map[status] || { cls: 'badge-gray', icon: 'fa-question-circle', label: status };
    return `<span class="badge ${s.cls}"><i class="fas ${s.icon}"></i>${s.label}</span>`;
}

/* ── Formulário de registro (registro-vacina.html) ── */

function initializeVacinaForm() {
    const form = document.getElementById('vacinaForm');
    if (!form) return;

    // Preview em tempo real
    const fields = {
        nome:          document.getElementById('vacinaNome'),
        status:        document.getElementById('vacinaStatus'),
        dataAplicacao: document.getElementById('vacinaAplicacao'),
        validade:      document.getElementById('vacinaValidade'),
        dataRenovacao: document.getElementById('vacinaRenovacao'),
    };

    const preview = {
        nome:      document.getElementById('previewNome'),
        status:    document.getElementById('previewStatus'),
        aplicacao: document.getElementById('previewAplicacao'),
        validade:  document.getElementById('previewValidade'),
        renovacao: document.getElementById('previewRenovacao'),
    };

    const statusLabels = {
        completa: { cls: 'badge-success', label: 'Completa' },
        pendente: { cls: 'badge-warning', label: 'Pendente' },
        vencida:  { cls: 'badge-danger',  label: 'Vencida'  },
    };

    function updatePreview() {
        // Nome
        if (preview.nome) {
            const val = fields.nome ? fields.nome.value.trim() : '';
            preview.nome.textContent = val || '—';
            preview.nome.classList.toggle('placeholder', !val);
        }

        // Status
        if (preview.status && fields.status) {
            const s = statusLabels[fields.status.value];
            if (s) {
                preview.status.innerHTML = `<span class="badge ${s.cls}">${s.label}</span>`;
            } else {
                preview.status.innerHTML = `<span class="badge badge-gray">—</span>`;
            }
        }

        // Datas
        [
            [fields.dataAplicacao, preview.aplicacao],
            [fields.validade,      preview.validade],
            [fields.dataRenovacao, preview.renovacao],
        ].forEach(([input, el]) => {
            if (!input || !el) return;
            const val = formatDate(input.value);
            el.textContent = val;
            el.classList.toggle('placeholder', !input.value);
        });
    }

    // Escuta mudanças em todos os campos
    Object.values(fields).forEach(f => {
        if (f) f.addEventListener('input', updatePreview);
        if (f) f.addEventListener('change', updatePreview);
    });

    // Submit
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const nome   = fields.nome   ? fields.nome.value.trim()   : '';
        const status = fields.status ? fields.status.value.trim() : '';

        // Validação básica
        if (!nome) {
            showFieldError(fields.nome, 'Informe o nome da vacina.');
            fields.nome.focus();
            return;
        }
        if (!status) {
            showFieldError(fields.status, 'Selecione o status da vacina.');
            fields.status.focus();
            return;
        }

        const vacina = {
            id:            Date.now(),
            nome,
            status,
            dataAplicacao: fields.dataAplicacao ? fields.dataAplicacao.value : '',
            validade:      fields.validade      ? fields.validade.value      : '',
            dataRenovacao: fields.dataRenovacao ? fields.dataRenovacao.value : '',
        };

        const vacinas = getVacinas();
        vacinas.push(vacina);
        saveVacinas(vacinas);

        // Feedback visual
        const btn = document.getElementById('btnRegistrar');
        if (btn) {
            btn.disabled  = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando…';
        }

        const toast = document.getElementById('toastSucesso');
        if (toast) {
            toast.classList.add('show');
        }

        setTimeout(() => {
            window.location.href = './vacinas.html';
        }, 1200);
    });
}

/* ── Listagem de vacinas (vacinas.html) ── */

function loadVacinas() {
    const tbody      = document.getElementById('vacinasTableBody');
    const emptyState = document.getElementById('vacinasEmptyState');
    const statC      = document.getElementById('statCompletas');
    const statP      = document.getElementById('statPendentes');
    const statV      = document.getElementById('statVencidas');

    if (!tbody) return;

    const vacinas = getVacinas();

    // Contadores
    const counts = { completa: 0, pendente: 0, vencida: 0 };
    vacinas.forEach(v => { if (counts[v.status] !== undefined) counts[v.status]++; });

    if (statC) statC.textContent = counts.completa;
    if (statP) statP.textContent = counts.pendente;
    if (statV) statV.textContent = counts.vencida;

    // Tabela / empty state
    if (vacinas.length === 0) {
        if (emptyState) emptyState.style.display = '';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    tbody.innerHTML = vacinas.map(v => `
        <tr>
          <td>
            <span style="font-weight:600;">${v.nome}</span>
          </td>
          <td>${vacinaBadge(v.status)}</td>
          <td>${formatDate(v.dataAplicacao)}</td>
          <td>${formatDate(v.dataRenovacao) !== '—'
                ? formatDate(v.dataRenovacao)
                : '<span style="color:var(--text-muted);font-size:12px;">Não informado</span>'
              }</td>
          <td>
            <div style="display:flex;gap:6px;">
              <button
                class="btn-ghost btn-sm"
                title="Excluir"
                onclick="excluirVacina(${v.id})"
                style="color:var(--danger);padding:5px 8px;">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
    `).join('');
}

/**
 * Remove uma vacina pelo ID e recarrega a listagem.
 * @param {number} id
 */
function excluirVacina(id) {
    const vacinas = getVacinas().filter(v => v.id !== id);
    saveVacinas(vacinas);
    loadVacinas();
}
