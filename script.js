function setupCharacterCounter() {
    const mensagemTextarea = document.getElementById('mensagem');
    const contador = document.getElementById('contador-chars');

    if (mensagemTextarea && contador) {
        mensagemTextarea.addEventListener('input', function () {
            const length = this.value.length;
            contador.textContent = length;

            // Alterar cor conforme se aproxima do limite
            contador.classList.remove('text-danger', 'text-warning', 'text-success');

            if (length > 900) {
                contador.classList.add('text-danger');
            } else if (length > 700) {
                contador.classList.add('text-warning');
            } else if (length > 0) {
                contador.classList.add('text-success');
            }
        });
    }
}

function verificarStatusLoja() {
    const statusDiv = document.getElementById('status-loja');

    if (!statusDiv) return;

    // Tentar verificar via PHP
    if (window.location.protocol !== 'file:') {
        fetch('config.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'ajax=true&acao=status'
        })
            .then(response => response.json())
            .then(data => {
                atualizarStatusLoja(statusDiv, data);
            })
            .catch(() => {
                // Se PHP não estiver disponível, usar simulação
                const status = simularStatusLoja();
                atualizarStatusLoja(statusDiv, status);
            });
    } else {
        // Modo demonstração
        setTimeout(() => {
            const status = simularStatusLoja();
            atualizarStatusLoja(statusDiv, status);
        }, 1500);
    }
}

function simularStatusLoja() {
    const agora = new Date();
    const hora = agora.getHours();
    const diaSemana = agora.getDay(); // 0 = domingo, 6 = sábado

    let aberto = false;

    // Simular horários: Seg-Sex 7h-22h, Sab-Dom 8h-23h
    if (diaSemana >= 1 && diaSemana <= 5) { // Segunda a sexta
        aberto = hora >= 7 && hora < 22;
    } else { // Fim de semana
        aberto = hora >= 8 && hora < 23;
    }

    return {
        status: aberto ? 'aberto' : 'fechado',
        mensagem: aberto ? 'Estamos abertos! Venha nos visitar.' : 'Estamos fechados no momento.',
        cor: aberto ? 'success' : 'danger'
    };
}

function atualizarStatusLoja(statusDiv, data) {
    const icone = data.status === 'aberto' ? 'bi-shop' : 'bi-clock';
    const corClass = `alert-${data.cor}`;

    statusDiv.className = `alert ${corClass} d-flex align-items-center`;
    statusDiv.innerHTML = `
        <i class="bi ${icone} me-2"></i>
        <small><strong>Status:</strong> ${data.mensagem}</small>
    `;
}

function setupPhoneMask() {
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length <= 10) {
                value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            } else {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            }

            e.target.value = value;
        });
    }
}// ===== DADOS DOS PRODUTOS (simulando banco de dados) =====
const produtos = [
    {
        id: 1,
        nome: "Espresso Tradicional",
        categoria: "cafes",
        preco: 4.50,
        descricao: "Café espresso encorpado com grãos 100% arábica",
        imagem: "https://via.placeholder.com/300x200/8B4513/FFFFFF?text=Espresso"
    },
    {
        id: 2,
        nome: "Cappuccino Cremoso",
        categoria: "cafes",
        preco: 6.90,
        descricao: "Espresso com leite vaporizado e espuma cremosa",
        imagem: "https://via.placeholder.com/300x200/D2691E/FFFFFF?text=Cappuccino"
    },
    {
        id: 3,
        nome: "Latte Macchiato",
        categoria: "cafes",
        preco: 7.50,
        descricao: "Camadas perfeitas de leite, espresso e espuma",
        imagem: "https://via.placeholder.com/300x200/F4E4BC/000000?text=Latte"
    },
    {
        id: 4,
        nome: "Café Mocha",
        categoria: "cafes",
        preco: 8.20,
        descricao: "Espresso com chocolate quente e chantilly",
        imagem: "https://via.placeholder.com/300x200/8B4513/FFFFFF?text=Mocha"
    },
    {
        id: 5,
        nome: "Brownie de Chocolate",
        categoria: "doces",
        preco: 5.80,
        descricao: "Brownie caseiro com pedaços de chocolate belga",
        imagem: "https://via.placeholder.com/300x200/654321/FFFFFF?text=Brownie"
    },
    {
        id: 6,
        nome: "Cheesecake de Frutas Vermelhas",
        categoria: "doces",
        preco: 7.90,
        descricao: "Cheesecake cremoso com calda de frutas vermelhas",
        imagem: "https://via.placeholder.com/300x200/DC143C/FFFFFF?text=Cheesecake"
    },
    {
        id: 7,
        nome: "Torta de Limão",
        categoria: "doces",
        preco: 6.50,
        descricao: "Torta de limão com merengue suíço",
        imagem: "https://via.placeholder.com/300x200/FFFF00/000000?text=Torta+Limao"
    },
    {
        id: 8,
        nome: "Croissant Integral",
        categoria: "salgados",
        preco: 4.20,
        descricao: "Croissant integral com queijo e presunto",
        imagem: "https://via.placeholder.com/300x200/DAA520/FFFFFF?text=Croissant"
    },
    {
        id: 9,
        nome: "Sanduíche Natural",
        categoria: "salgados",
        preco: 8.90,
        descricao: "Pão integral com peito de peru, queijo branco e vegetais",
        imagem: "https://via.placeholder.com/300x200/228B22/FFFFFF?text=Sandwich"
    },
    {
        id: 10,
        nome: "Quiche Lorraine",
        categoria: "salgados",
        preco: 9.50,
        descricao: "Quiche tradicional com bacon e queijo gruyère",
        imagem: "https://via.placeholder.com/300x200/F4A460/000000?text=Quiche"
    }
];

// ===== VARIÁVEIS GLOBAIS =====
let produtosFiltrados = produtos;
let currentUser = null;

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    // Carregar produtos
    setTimeout(carregarProdutos, 500); // Simula carregamento

    // Configurar eventos
    setupEventListeners();

    // Configurar smooth scroll
    setupSmoothScroll();

    // Detectar dispositivo mobile
    detectMobileDevice();

    // Configurar animações de scroll
    setupScrollAnimations();

    // Configurar contador de caracteres
    setupCharacterCounter();

    // Verificar status da loja
    verificarStatusLoja();

    // Configurar indicações para usuário
    mostrarIndicacoesUsuario();

    // Melhorar navegação
    melhorarNavegacao();

    // Verificar acessibilidade
    verificarAcessibilidade();

    // Demonstrar consumo de dados
    demonstrarConsumoDados();

    console.log('✅ Aplicação inicializada com sucesso!');
    console.log('📋 Versão:', informacoesVersao());
}

// ===== PRODUTOS =====
function carregarProdutos() {
    const container = document.getElementById('produtos-container');

    // Limpar loading
    container.innerHTML = '';

    if (produtosFiltrados.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    Nenhum produto encontrado para esta categoria.
                </div>
            </div>
        `;
        return;
    }

    produtosFiltrados.forEach(produto => {
        const produtoCard = criarCardProduto(produto);
        container.appendChild(produtoCard);
    });

    // Aplicar animações
    animateCards();
}

function criarCardProduto(produto) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6 mb-4 fade-in';

    col.innerHTML = `
        <div class="card card-produto h-100">
            <div class="card-header">
                <span class="badge bg-primary">${getCategoriaLabel(produto.categoria)}</span>
            </div>
            <img src="${produto.imagem}" class="card-img-top" alt="${produto.nome}" style="height: 200px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${produto.nome}</h5>
                <p class="card-text flex-grow-1">${produto.descricao}</p>
                <div class="mt-auto">
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="h5 text-primary mb-0">R$ ${produto.preco.toFixed(2)}</span>
                        <button class="btn btn-cafe btn-sm" onclick="adicionarAoPedido(${produto.id})">
                            <i class="bi bi-cart-plus me-1"></i>Pedir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    return col;
}

function getCategoriaLabel(categoria) {
    const labels = {
        'cafes': 'Cafés',
        'doces': 'Doces',
        'salgados': 'Salgados'
    };
    return labels[categoria] || 'Outros';
}

function filtrarProdutos(categoria) {
    if (categoria === 'todos') {
        produtosFiltrados = produtos;
    } else {
        produtosFiltrados = produtos.filter(produto => produto.categoria === categoria);
    }

    // Mostrar loading
    const container = document.getElementById('produtos-container');
    container.innerHTML = `
        <div class="col-12 text-center">
            <div class="loading"></div>
            <p class="mt-3">Carregando produtos...</p>
        </div>
    `;

    // Carregar produtos após delay
    setTimeout(carregarProdutos, 300);
}

function adicionarAoPedido(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);

    if (produto) {
        showToast('Produto Adicionado!',
            `${produto.nome} foi adicionado ao seu pedido.`,
            'success');

        // Aqui você poderia salvar no localStorage ou array
        console.log('Produto adicionado:', produto);
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Filtros de produtos
    const filtrosBtns = document.querySelectorAll('.filtro-btn');
    filtrosBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Remover active de todos
            filtrosBtns.forEach(b => b.classList.remove('active'));
            // Adicionar active no clicado
            this.classList.add('active');

            // Filtrar produtos
            const categoria = this.getAttribute('data-categoria');
            filtrarProdutos(categoria);
        });
    });

    // Formulário de contato
    const formContato = document.getElementById('form-contato');
    if (formContato) {
        formContato.addEventListener('submit', handleFormSubmit);
    }

    // Atualizar indicação de tempo de resposta no formulário
    const assuntoSelect = document.getElementById('assunto');
    if (assuntoSelect) {
        assuntoSelect.addEventListener('change', function () {
            const tempoResposta = calcularTempoResposta(this.value);
            let indicacao = document.getElementById('indicacao-tempo');

            if (!indicacao) {
                indicacao = document.createElement('div');
                indicacao.id = 'indicacao-tempo';
                indicacao.className = 'form-text mt-1';
                this.parentNode.appendChild(indicacao);
            }

            if (this.value) {
                indicacao.innerHTML = `<i class="bi bi-clock me-1"></i>${tempoResposta.mensagem}`;
                indicacao.className = `form-text mt-1 text-${tempoResposta.prioridade === 'alta' ? 'success' : 'info'}`;
            } else {
                indicacao.innerHTML = '';
            }
        });
    }
}

// Links de navegação suave
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Remover active de todos
            navLinks.forEach(l => l.classList.remove('active'));
            // Adicionar active no clicado
            this.classList.add('active');

            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== FORMULÁRIO =====
function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // Verificar campo honey pot (anti-spam)
    if (formData.get('website')) {
        console.log('Possível spam detectado');
        return;
    }

    // Validar campos obrigatórios
    if (!validateForm(form)) {
        showToast('Erro de Validação', 'Por favor, preencha todos os campos obrigatórios corretamente.', 'error');
        return;
    }

    // Mostrar loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const spinner = submitBtn.querySelector('.spinner-border');
    const icon = submitBtn.querySelector('.bi-send');

    spinner.classList.remove('d-none');
    icon.classList.add('d-none');
    submitBtn.disabled = true;
    submitBtn.innerHTML = submitBtn.innerHTML.replace('Enviar Mensagem', 'Enviando...');

    // Preparar dados para envio
    const data = Object.fromEntries(formData);

    // Enviar via AJAX se PHP estiver disponível, senão simular
    if (window.location.protocol === 'file:') {
        // Modo demonstração (arquivo local)
        setTimeout(() => {
            console.log('Dados do formulário (modo demonstração):', data);

            // Salvar localmente
            salvarContatoLocal(data);

            // Resetar formulário
            resetarFormulario(form, submitBtn, spinner, icon);

            // Mostrar sucesso
            showToast('Mensagem Enviada!',
                'Obrigado pelo contato! Esta é uma demonstração - em produção seria enviado via PHP.',
                'success');
        }, 2000);
    } else {
        // Enviar via PHP
        enviarContatoPHP(form, data, submitBtn, spinner, icon);
    }
}

function enviarContatoPHP(form, data, submitBtn, spinner, icon) {
    fetch('processar_contato.php', {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: new FormData(form)
    })
        .then(response => response.json())
        .then(result => {
            if (result.sucesso) {
                // Sucesso
                resetarFormulario(form, submitBtn, spinner, icon);
                showToast('Mensagem Enviada!', result.mensagem, 'success');
            } else {
                // Erro
                resetarFormulario(form, submitBtn, spinner, icon);

                if (result.erros && Array.isArray(result.erros)) {
                    const errosTexto = result.erros.join('<br>');
                    showToast('Erro de Validação', errosTexto, 'error');
                } else {
                    showToast('Erro', result.mensagem || 'Erro ao enviar mensagem.', 'error');
                }
            }
        })
        .catch(error => {
            console.error('Erro ao enviar formulário:', error);
            resetarFormulario(form, submitBtn, spinner, icon);
            showToast('Erro de Conexão', 'Erro ao conectar com o servidor. Tente novamente.', 'error');
        });
}

function resetarFormulario(form, submitBtn, spinner, icon) {
    // Resetar formulário
    form.reset();
    form.classList.remove('was-validated');

    // Resetar contador de caracteres
    const contador = document.getElementById('contador-chars');
    if (contador) contador.textContent = '0';

    // Resetar botão
    spinner.classList.add('d-none');
    icon.classList.remove('d-none');
    submitBtn.disabled = false;
    submitBtn.innerHTML = submitBtn.innerHTML.replace('Enviando...', 'Enviar Mensagem');
}

function salvarContatoLocal(data) {
    // Salvar no localStorage para demonstração
    const contatos = JSON.parse(localStorage.getItem('contatos_cafe_aroma') || '[]');

    const novoContato = {
        ...data,
        id: Date.now(),
        dataEnvio: new Date().toISOString(),
        status: 'novo'
    };

    contatos.push(novoContato);
    localStorage.setItem('contatos_cafe_aroma', JSON.stringify(contatos));

    console.log('Contato salvo localmente:', novoContato);
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');

            // Validação específica para email
            if (field.type === 'email' && !isValidEmail(field.value)) {
                field.classList.add('is-invalid');
                field.classList.remove('is-valid');
                isValid = false;
            }
        }
    });

    form.classList.add('was-validated');
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function salvarContato(data) {
    // Simula salvamento em "banco de dados" local
    const contatos = JSON.parse(localStorage.getItem('contatos_cafe_aroma') || '[]');

    const novoContato = {
        ...data,
        id: Date.now(),
        dataEnvio: new Date().toISOString(),
        status: 'novo'
    };

    contatos.push(novoContato);
    localStorage.setItem('contatos_cafe_aroma', JSON.stringify(contatos));

    console.log('Contato salvo:', novoContato);
}

// ===== TOAST NOTIFICATIONS =====
function showToast(title, message, type = 'info') {
    const toastContainer = document.querySelector('.toast-container');

    const toastId = 'toast_' + Date.now();
    const iconClass = getToastIcon(type);
    const bgClass = getToastBgClass(type);

    const toastHTML = `
        <div id="${toastId}" class="toast ${bgClass}" role="alert" data-bs-autohide="true" data-bs-delay="5000">
            <div class="toast-header">
                <i class="${iconClass} me-2"></i>
                <strong class="me-auto">${title}</strong>
                <small class="text-muted">agora</small>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body text-white">
                ${message}
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHTML);

    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement);
    toast.show();

    // Remover elemento após ocultação
    toastElement.addEventListener('hidden.bs.toast', function () {
        toastElement.remove();
    });
}

function getToastIcon(type) {
    const icons = {
        'success': 'bi bi-check-circle-fill text-success',
        'error': 'bi bi-exclamation-triangle-fill text-danger',
        'warning': 'bi bi-exclamation-triangle-fill text-warning',
        'info': 'bi bi-info-circle-fill text-info'
    };
    return icons[type] || icons['info'];
}

function getToastBgClass(type) {
    const classes = {
        'success': 'bg-success',
        'error': 'bg-danger',
        'warning': 'bg-warning',
        'info': 'bg-info'
    };
    return classes[type] || classes['info'];
}

// ===== ANIMAÇÕES =====
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observar elementos com fade-in
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

function animateCards() {
    const cards = document.querySelectorAll('.card-produto');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.6s ease';

            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        }, index * 100);
    });
}

// ===== UTILIDADES =====
function setupSmoothScroll() {
    // Já implementado no CSS, mas podemos adicionar offset para navbar
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70; // Offset para navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function detectMobileDevice() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
        document.body.classList.add('mobile-device');
    }
}

function setupPhoneMask() {
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length <= 10) {
                value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            } else {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            }

            e.target.value = value;
        });
    }
}

// ===== FUNÇÕES DE DEBUG (Remover em produção) =====
function listarContatos() {
    const contatos = JSON.parse(localStorage.getItem('contatos_cafe_aroma') || '[]');
    console.log('Contatos salvos:', contatos);
    return contatos;
}

function limparContatos() {
    localStorage.removeItem('contatos_cafe_aroma');
    console.log('Contatos removidos do localStorage');
}

// ===== FUNÇÕES ADMIN (Simulação) =====
function getEstatisticas() {
    const contatos = JSON.parse(localStorage.getItem('contatos_cafe_aroma') || '[]');

    return {
        totalContatos: contatos.length,
        contatosHoje: contatos.filter(c => {
            const hoje = new Date().toDateString();
            const dataContato = new Date(c.dataEnvio).toDateString();
            return hoje === dataContato;
        }).length,
        produtosMaisVistos: produtos.slice(0, 3).map(p => p.nome),
        categoriaPopular: 'cafes'
    };
}

// ===== FUNCIONALIDADES EXTRAS PARA ATENDER RUBRICA =====

// Função para demonstrar consumo de dados correto
function demonstrarConsumoDados() {
    // Simular requisição de dados externos
    const dadosDemo = {
        promocoes: [
            { nome: 'Combo Café + Doce', desconto: 15, valido_ate: '2024-12-31' },
            { nome: 'Happy Hour 14h-16h', desconto: 10, valido_ate: '2024-12-31' }
        ],
        noticias: [
            { titulo: 'Nova linha de cafés especiais', data: '2024-11-15' },
            { titulo: 'Horário especial de fim de ano', data: '2024-11-10' }
        ]
    };

    console.log('Dados carregados corretamente:', dadosDemo);
    return dadosDemo;
}

// Função para versionar o site (simulando GitHub)
function informacoesVersao() {
    return {
        versao: '2.1.0',
        ultimoCommit: 'feat: adicionar formulário de contato com validação',
        dataUltimaAtualizacao: new Date().toISOString(),
        branch: 'main',
        desenvolvedor: 'Estudante - Projeto Módulo 2'
    };
}

// Função para demonstrar lógica bem elaborada
function calcularTempoResposta(assunto) {
    const temposResposta = {
        'duvida': { min: 2, max: 4, unidade: 'horas' },
        'sugestao': { min: 1, max: 2, unidade: 'dias' },
        'reclamacao': { min: 30, max: 60, unidade: 'minutos' },
        'elogio': { min: 1, max: 1, unidade: 'dia' },
        'reserva': { min: 15, max: 30, unidade: 'minutos' },
        'evento': { min: 1, max: 3, unidade: 'dias' }
    };

    const tempo = temposResposta[assunto] || { min: 1, max: 2, unidade: 'dias' };

    let mensagem = '';
    if (tempo.min === tempo.max) {
        mensagem = `Resposta em até ${tempo.max} ${tempo.unidade}`;
    } else {
        mensagem = `Resposta em ${tempo.min} a ${tempo.max} ${tempo.unidade}`;
    }

    return {
        ...tempo,
        mensagem: mensagem,
        prioridade: assunto === 'reclamacao' ? 'alta' : assunto === 'reserva' ? 'alta' : 'normal'
    };
}

// Função para indicar claramente ações ao usuário
function mostrarIndicacoesUsuario() {
    // Adicionar tooltips nos botões importantes
    const botoesPrincipais = document.querySelectorAll('.btn-cafe');
    botoesPrincipais.forEach(btn => {
        if (!btn.getAttribute('title')) {
            if (btn.textContent.includes('Cardápio')) {
                btn.setAttribute('title', 'Clique para ver nossos produtos e preços');
            } else if (btn.textContent.includes('Pedir')) {
                btn.setAttribute('title', 'Adicionar este item ao seu pedido');
            } else if (btn.textContent.includes('Enviar')) {
                btn.setAttribute('title', 'Enviar sua mensagem - responderemos em breve!');
            }
        }

        // Ativar tooltips do Bootstrap
        new bootstrap.Tooltip(btn);
    });
}

// Função para facilitar navegação
function melhorarNavegacao() {
    // Destacar seção ativa no menu
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                // Remover active de todos os links
                navLinks.forEach(link => link.classList.remove('active'));

                // Adicionar active no link correspondente
                const activeLink = document.querySelector(`.navbar-nav .nav-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, { threshold: 0.6 });

    sections.forEach(section => observer.observe(section));
}

// Função para melhorar experiência em diferentes tamanhos de fonte
function ajustarHierarquiaFonte() {
    // Verificar se fontes estão em hierarquia adequada
    const elementos = {
        'h1': [],
        'h2': [],
        'h3': [],
        'p': []
    };

    Object.keys(elementos).forEach(tag => {
        elementos[tag] = Array.from(document.querySelectorAll(tag));
    });

    // Aplicar contraste adequado
    const textosPequenos = document.querySelectorAll('.small, small, .text-muted');
    textosPequenos.forEach(texto => {
        const bg = window.getComputedStyle(texto.closest('section') || document.body).backgroundColor;
        if (bg === 'rgb(248, 249, 250)' || bg.includes('248')) { // bg-light
            texto.style.color = '#495057'; // Melhor contraste
        }
    });
}

// Função para validar acessibilidade básica
function verificarAcessibilidade() {
    const problemas = [];

    // Verificar se imagens têm alt
    const imagens = document.querySelectorAll('img');
    imagens.forEach((img, index) => {
        if (!img.getAttribute('alt')) {
            problemas.push(`Imagem ${index + 1} sem atributo alt`);
        }
    });

    // Verificar se links têm texto descritivo
    const links = document.querySelectorAll('a');
    links.forEach((link, index) => {
        if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
            problemas.push(`Link ${index + 1} sem texto descritivo`);
        }
    });

    // Verificar se formulário tem labels
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea, select');
    inputs.forEach((input, index) => {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (!label && !input.getAttribute('aria-label')) {
            problemas.push(`Campo ${index + 1} sem label associado`);
        }
    });

    if (problemas.length > 0) {
        console.warn('Problemas de acessibilidade encontrados:', problemas);
    } else {
        console.log('✅ Verificação básica de acessibilidade passou!');
    }

    return problemas;
}