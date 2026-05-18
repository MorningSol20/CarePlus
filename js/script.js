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
    loadReceitas();
    initializeReceitaModal();
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
   RECEITAS — Mock de dados e modal de visualização
   ============================================================ */

const RECEITAS_MOCK = [
    {
        id: 'REC-2026-001',
        diagnostico: 'Influenza A + Otite Média Aguda',
        instituicao: 'Clínica São Lucas',
        medico: 'Dra. Ana Carvalho',
        crm: 'CRM-SP 12.345',
        especialidade: 'Clínico Geral',
        emissao: '2026-05-10',
        validade: '2026-06-09',
        itens: [
            {
                medicamento: 'Oseltamivir (Tamiflu) 75 mg',
                posologia: '1 cápsula de 12 em 12 horas, por 5 dias',
                observacao: 'Iniciar o tratamento em até 48h do início dos sintomas. Tomar com alimento.'
            },
            {
                medicamento: 'Amoxicilina 500 mg',
                posologia: '1 cápsula de 8 em 8 horas, por 7 dias',
                observacao: 'Manter a série completa mesmo com melhora dos sintomas.'
            },
            {
                medicamento: 'Ibuprofeno 600 mg',
                posologia: '1 comprimido de 8 em 8 horas, por até 5 dias',
                observacao: 'Usar somente em caso de dor ou febre ≥ 38 °C. Não exceder 3 comprimidos por dia.'
            },
            {
                medicamento: 'Dipirona Sódica 500 mg',
                posologia: '1 comprimido de 6 em 6 horas, conforme necessidade',
                observacao: 'Se febre persistir acima de 38,5 °C. Não usar junto com Ibuprofeno.'
            }
        ]
    },
    {
        id: 'REC-2025-047',
        diagnostico: 'Síndrome Gripal — Influenza',
        instituicao: 'UBS Vila Mariana',
        medico: 'Dr. Lucas Almeida',
        crm: 'CRM-SP 54.321',
        especialidade: 'Clínico Geral',
        emissao: '2025-11-15',
        validade: '2025-12-15',
        itens: [
            {
                medicamento: 'Paracetamol 750 mg',
                posologia: '1 comprimido de 6 em 6 horas, conforme necessidade',
                observacao: 'Usar somente em caso de febre ou dor. Não exceder 4 comprimidos por dia.'
            },
            {
                medicamento: 'Loratadina 10 mg',
                posologia: '1 comprimido ao dia, por 7 dias',
                observacao: 'Tomar preferencialmente à noite. Pode causar sonolência leve.'
            },
            {
                medicamento: 'Solução Fisiológica Nasal 0,9%',
                posologia: '2 jatos em cada narina, 3 vezes ao dia, por 7 dias',
                observacao: 'Para higiene e desobstrução nasal. Incline levemente a cabeça ao aplicar.'
            }
        ]
    }
];

/**
 * Calcula o status de uma receita com base na data de validade.
 * @param {string} validade  YYYY-MM-DD
 * @returns {'ativa'|'expirada'}
 */
function getReceitaStatus(validade) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return new Date(validade + 'T00:00:00') >= hoje ? 'ativa' : 'expirada';
}

/**
 * Retorna o HTML do badge para o status de uma receita.
 */
function receitaBadge(status) {
    if (status === 'ativa') {
        return `<span class="badge badge-success"><i class="fas fa-check-circle"></i>Ativa</span>`;
    }
    return `<span class="badge badge-danger"><i class="fas fa-hourglass-end"></i>Expirada</span>`;
}

/**
 * Renderiza a tabela de receitas e atualiza os contadores.
 */
function loadReceitas() {
    const tbody     = document.getElementById('receitasTableBody');
    const statAtiva = document.getElementById('statAtivas');
    const statExp   = document.getElementById('statExpiradas');
    const statTot   = document.getElementById('statTotal');

    if (!tbody) return;

    let ativas = 0, expiradas = 0;

    tbody.innerHTML = RECEITAS_MOCK.map(r => {
        const status = getReceitaStatus(r.validade);
        if (status === 'ativa') ativas++; else expiradas++;

        const rowStyle = status === 'expirada'
            ? 'opacity:.75;'
            : '';

        return `
          <tr style="${rowStyle}">
            <td>
              <div style="font-weight:600;line-height:1.3;">${r.id}</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${r.diagnostico}</div>
            </td>
            <td>
              <div style="font-weight:500;">${r.medico}</div>
              <div style="font-size:11px;color:var(--text-muted);">${r.especialidade}</div>
            </td>
            <td>${formatDate(r.emissao)}</td>
            <td style="color:${status === 'expirada' ? 'var(--danger)' : 'var(--text-primary)'};">
              ${formatDate(r.validade)}
            </td>
            <td>${receitaBadge(status)}</td>
            <td>
              <button
                class="btn-ghost"
                title="Visualizar receita"
                onclick="openReceitaModal('${r.id}')"
                style="padding:7px;color:var(--primary);">
                <i class="fas fa-eye"></i>
              </button>
            </td>
          </tr>`;
    }).join('');

    if (statAtiva) statAtiva.textContent = ativas;
    if (statExp)   statExp.textContent   = expiradas;
    if (statTot)   statTot.textContent   = RECEITAS_MOCK.length;
}

/**
 * Inicializa os eventos de fechar o modal de receita.
 */
function initializeReceitaModal() {
    const modal    = document.getElementById('receitaModal');
    if (!modal) return;

    function closeModal() { modal.classList.remove('show'); }

    document.getElementById('receitaModalClose').addEventListener('click', closeModal);
    document.getElementById('receitaModalFechar').addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
    });
}

/**
 * Abre o modal com os dados de uma receita específica.
 * @param {string} receitaId
 */
function openReceitaModal(receitaId) {
    const modal   = document.getElementById('receitaModal');
    const receita = RECEITAS_MOCK.find(r => r.id === receitaId);
    if (!modal || !receita) return;

    const status = getReceitaStatus(receita.validade);

    document.getElementById('modalReceitaTitulo').textContent     = receita.id;
    document.getElementById('modalReceitaStatusBadge').innerHTML  = receitaBadge(status);
    document.getElementById('modalReceitaDiagnostico').textContent = receita.diagnostico;
    document.getElementById('modalInstituicao').textContent       = receita.instituicao;
    document.getElementById('modalMedico').textContent            = receita.medico;
    document.getElementById('modalCRM').textContent               = receita.crm;
    document.getElementById('modalEspecialidade').textContent     = receita.especialidade;
    document.getElementById('modalEmissao').textContent           = formatDate(receita.emissao);
    document.getElementById('modalValidade').textContent          = formatDate(receita.validade);

    // Altera cor da validade se expirada
    const validadeEl = document.getElementById('modalValidade');
    validadeEl.style.color = status === 'expirada' ? 'var(--danger)' : '';

    // Itens da receita
    document.getElementById('modalItens').innerHTML = receita.itens.map((item, i) => `
        <div class="receita-item">
          <div class="receita-item-num">${i + 1}</div>
          <div class="receita-item-body">
            <div class="receita-item-nome">${item.medicamento}</div>
            <div class="receita-item-posologia">${item.posologia}</div>
            ${item.observacao
                ? `<span class="receita-item-obs"><i class="fas fa-info-circle" style="margin-right:4px;color:var(--info);"></i>${item.observacao}</span>`
                : ''}
          </div>
        </div>`
    ).join('');

    modal.classList.add('show');
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
   VACINAS — Lista predefinida, registros e modal
   ============================================================ */

/**
 * Lista oficial de vacinas recomendadas.
 * renovacaoDias: null = dose única (proteção vitalícia)
 * renovacaoDias: número = dias até a próxima dose/reforço
 */
const VACINAS_LISTA = [
    { id: 'bcg',             nome: 'BCG',                      protecao: 'Tuberculose',                    renovacaoDias: null  },
    { id: 'hepatite-b',      nome: 'Hepatite B',               protecao: 'Hepatite B',                     renovacaoDias: null  },
    { id: 'hepatite-a',      nome: 'Hepatite A',               protecao: 'Hepatite A',                     renovacaoDias: null  },
    { id: 'pentavalente',    nome: 'Pentavalente',             protecao: 'Difteria, Tétano, Coqueluche, Hib e Hepatite B', renovacaoDias: null },
    { id: 'poliomielite',    nome: 'Poliomielite (VIP/VOP)',   protecao: 'Paralisia infantil',             renovacaoDias: null  },
    { id: 'rotavirus',       nome: 'Rotavírus',                protecao: 'Gastroenterite por Rotavírus',   renovacaoDias: null  },
    { id: 'pneumococica-10', nome: 'Pneumocócica 10-valente',  protecao: 'Pneumonia e infecções bacterianas', renovacaoDias: null },
    { id: 'pneumococica-23', nome: 'Pneumocócica 23-valente',  protecao: 'Pneumonia (adultos e idosos)',   renovacaoDias: 1825  },
    { id: 'meningococica-c', nome: 'Meningocócica C',          protecao: 'Meningite C',                    renovacaoDias: null  },
    { id: 'meningococica-acwy', nome: 'Meningocócica ACWY',   protecao: 'Meningite ACWY',                 renovacaoDias: 1825  },
    { id: 'febre-amarela',   nome: 'Febre Amarela',            protecao: 'Febre Amarela',                  renovacaoDias: null  },
    { id: 'triplice-viral',  nome: 'Tríplice Viral (SCR)',     protecao: 'Sarampo, Caxumba e Rubéola',    renovacaoDias: null  },
    { id: 'varicela',        nome: 'Varicela',                 protecao: 'Catapora',                       renovacaoDias: null  },
    { id: 'hpv',             nome: 'HPV',                      protecao: 'Papilomavírus Humano',           renovacaoDias: null  },
    { id: 'influenza',       nome: 'Influenza',                protecao: 'Gripe sazonal',                  renovacaoDias: 365   },
    { id: 'dt',              nome: 'dT — Dupla Adulto',        protecao: 'Difteria e Tétano',             renovacaoDias: 3650  },
    { id: 'dtpa',            nome: 'dTpa — Tríplice Acelular', protecao: 'Difteria, Tétano e Coqueluche (adulto)', renovacaoDias: 3650 },
    { id: 'covid-19',        nome: 'COVID-19',                 protecao: 'Coronavírus',                    renovacaoDias: 365   },
    { id: 'dengue',          nome: 'Dengue',                   protecao: 'Dengue',                         renovacaoDias: null  },
    { id: 'herpes-zoster',   nome: 'Herpes Zóster',            protecao: 'Herpes Zóster (adultos ≥50 anos)', renovacaoDias: null },
];

/**
 * Retorna os registros salvos no localStorage.
 * Estrutura: { [vacinaId]: { dataAplicacao: 'YYYY-MM-DD', validade: 'YYYY-MM-DD' | null } }
 */
function getVacinasRegistros() {
    try {
        return JSON.parse(localStorage.getItem('careplus_vacinas_registros') || '{}');
    } catch {
        return {};
    }
}

/**
 * Salva os registros no localStorage.
 */
function saveVacinasRegistros(registros) {
    localStorage.setItem('careplus_vacinas_registros', JSON.stringify(registros));
}

/**
 * Formata uma string ISO (YYYY-MM-DD) para DD/MM/YYYY.
 */
function formatDate(iso) {
    if (!iso) return '—';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
}

/**
 * Calcula a data de validade somando dias à data de aplicação.
 * Retorna string YYYY-MM-DD ou null (dose única).
 */
function calcularValidade(dataAplicacao, renovacaoDias) {
    if (!renovacaoDias || !dataAplicacao) return null;
    const data = new Date(dataAplicacao + 'T00:00:00');
    data.setDate(data.getDate() + renovacaoDias);
    return data.toISOString().split('T')[0];
}

/**
 * Determina o status de uma vacina com base no registro e na data atual.
 * Retorna: 'nao-registrada' | 'aplicada' | 'vencida'
 */
function getVacinaStatus(vacina, registro) {
    if (!registro || !registro.dataAplicacao) return 'nao-registrada';
    if (!vacina.renovacaoDias) return 'aplicada'; // dose única, nunca vence

    const hoje    = new Date();
    hoje.setHours(0, 0, 0, 0);
    const validade = new Date(registro.validade + 'T00:00:00');

    return validade < hoje ? 'vencida' : 'aplicada';
}

/**
 * Retorna o HTML do badge para um status de vacina.
 */
function vacinaBadge(status) {
    const map = {
        'aplicada':       { cls: 'badge-success', icon: 'fa-check-circle',      label: 'Aplicada'       },
        'vencida':        { cls: 'badge-danger',  icon: 'fa-exclamation-circle', label: 'Vencida'        },
        'nao-registrada': { cls: 'badge-gray',    icon: 'fa-minus-circle',       label: 'Não registrada' },
    };
    const s = map[status] || map['nao-registrada'];
    return `<span class="badge ${s.cls}"><i class="fas ${s.icon}"></i>${s.label}</span>`;
}

/* ── Listagem (vacinas.html) ── */

function loadVacinas() {
    const tbody   = document.getElementById('vacinasTableBody');
    const statA   = document.getElementById('statAplicadas');
    const statV   = document.getElementById('statVencidas');
    const statN   = document.getElementById('statNaoRegistradas');
    const totalEl = document.getElementById('vacinasTotal');

    if (!tbody) return;

    const registros = getVacinasRegistros();
    const counts    = { aplicada: 0, vencida: 0, 'nao-registrada': 0 };

    tbody.innerHTML = VACINAS_LISTA.map(vacina => {
        const registro = registros[vacina.id] || null;
        const status   = getVacinaStatus(vacina, registro);
        counts[status]++;

        const dataAplicacao = registro ? formatDate(registro.dataAplicacao) : '—';
        const validadeStr   = registro && registro.validade
            ? formatDate(registro.validade)
            : vacina.renovacaoDias === null && registro
                ? '<span class="badge badge-info" style="font-size:10px;"><i class="fas fa-shield-alt"></i>Dose única</span>'
                : '<span style="color:var(--text-muted);font-size:12px;">—</span>';

        const btnLabel = registro ? 'Editar' : 'Registrar';
        const btnIcon  = registro ? 'fa-pencil-alt' : 'fa-syringe';
        const btnStyle = registro ? 'btn-ghost btn-sm' : 'btn-outline btn-sm';

        return `
          <tr>
            <td>
              <div style="font-weight:600;line-height:1.3;">${vacina.nome}</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${vacina.protecao}</div>
            </td>
            <td>${vacinaBadge(status)}</td>
            <td style="color:${registro ? 'var(--text-primary)' : 'var(--text-muted)'};">${dataAplicacao}</td>
            <td>${validadeStr}</td>
            <td>
              <button
                class="${btnStyle}"
                title="${btnLabel}"
                onclick="openVacinaModal('${vacina.id}')">
                <i class="fas ${btnIcon}"></i>
                ${btnLabel}
              </button>
            </td>
          </tr>`;
    }).join('');

    if (statA) statA.textContent = counts['aplicada'];
    if (statV) statV.textContent = counts['vencida'];
    if (statN) statN.textContent = counts['nao-registrada'];
    if (totalEl) totalEl.textContent = `${VACINAS_LISTA.length} vacinas`;
}

/* ── Modal de aplicação ── */

function initializeVacinaForm() {
    const modal      = document.getElementById('vacinaModal');
    if (!modal) return;

    const closeBtn   = document.getElementById('modalCloseBtn');
    const cancelBtn  = document.getElementById('modalCancelBtn');
    const salvarBtn  = document.getElementById('modalSalvarBtn');
    const removerBtn = document.getElementById('modalRemoverBtn');
    const dataInput  = document.getElementById('modalDataAplicacao');

    function closeModal() {
        modal.classList.remove('show');
        dataInput.value = '';
        document.getElementById('modalValidadePreview').style.display = 'none';
        document.getElementById('modalDoseUnica').style.display       = 'none';
        document.getElementById('modalRemoverArea').style.display     = 'none';
    }

    closeBtn.addEventListener('click',  closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
    });

    // Atualiza preview da validade ao mudar a data
    dataInput.addEventListener('input', function () {
        const vacinaId = document.getElementById('modalVacinaId').value;
        const vacina   = VACINAS_LISTA.find(v => v.id === vacinaId);
        if (!vacina || !this.value) return;
        atualizarPreviewValidade(vacina, this.value);
    });

    // Salvar
    salvarBtn.addEventListener('click', function () {
        const vacinaId = document.getElementById('modalVacinaId').value;
        const data     = dataInput.value;

        if (!data) {
            dataInput.style.borderColor = 'var(--danger)';
            dataInput.focus();
            setTimeout(() => { dataInput.style.borderColor = ''; }, 2000);
            return;
        }

        const vacina    = VACINAS_LISTA.find(v => v.id === vacinaId);
        const validade  = calcularValidade(data, vacina ? vacina.renovacaoDias : null);
        const registros = getVacinasRegistros();

        registros[vacinaId] = { dataAplicacao: data, validade };
        saveVacinasRegistros(registros);

        closeModal();
        loadVacinas();
    });

    // Remover registro
    removerBtn.addEventListener('click', function () {
        const vacinaId  = document.getElementById('modalVacinaId').value;
        const registros = getVacinasRegistros();
        delete registros[vacinaId];
        saveVacinasRegistros(registros);
        closeModal();
        loadVacinas();
    });
}

/**
 * Atualiza o bloco de preview de validade dentro do modal.
 */
function atualizarPreviewValidade(vacina, dataAplicacao) {
    const previewEl = document.getElementById('modalValidadePreview');
    const doseEl    = document.getElementById('modalDoseUnica');
    const dataEl    = document.getElementById('modalValidadeData');
    const descEl    = document.getElementById('modalValidadeDescricao');

    if (vacina.renovacaoDias === null) {
        if (previewEl) previewEl.style.display = 'none';
        if (doseEl)    doseEl.style.display    = 'flex';
    } else {
        if (doseEl)    doseEl.style.display    = 'none';
        const validade = calcularValidade(dataAplicacao, vacina.renovacaoDias);
        if (dataEl) dataEl.textContent = formatDate(validade);
        if (descEl) {
            const anos = Math.round(vacina.renovacaoDias / 365);
            descEl.textContent = anos >= 1
                ? `Reforço necessário em ${anos} ano${anos > 1 ? 's' : ''}`
                : `Reforço necessário em ${vacina.renovacaoDias} dias`;
        }
        if (previewEl) previewEl.style.display = 'flex';
    }
}

/**
 * Abre o modal pré-preenchido para uma vacina específica.
 * @param {string} vacinaId
 */
function openVacinaModal(vacinaId) {
    const modal   = document.getElementById('vacinaModal');
    const vacina  = VACINAS_LISTA.find(v => v.id === vacinaId);
    if (!modal || !vacina) return;

    const registro  = getVacinasRegistros()[vacinaId] || null;
    const dataInput = document.getElementById('modalDataAplicacao');

    document.getElementById('modalVacinaId').value      = vacinaId;
    document.getElementById('modalVacinaNome').textContent    = vacina.nome;
    document.getElementById('modalVacinaProtecao').textContent = vacina.protecao;

    // Preenche data se já tiver registro
    dataInput.value = registro ? registro.dataAplicacao : '';

    // Preview de validade
    if (dataInput.value) {
        atualizarPreviewValidade(vacina, dataInput.value);
    } else {
        document.getElementById('modalValidadePreview').style.display = 'none';
        document.getElementById('modalDoseUnica').style.display       = 'none';
    }

    // Área de remoção (só exibida quando já há registro)
    document.getElementById('modalRemoverArea').style.display = registro ? 'block' : 'none';

    modal.classList.add('show');
    setTimeout(() => dataInput.focus(), 200);
}
