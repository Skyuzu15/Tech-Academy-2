<?php
// ===== CONFIGURAÇÕES DO SISTEMA =====
// Arquivo: config.php

// Informações da empresa
define('EMPRESA_NOME', 'Café Aroma');
define('EMPRESA_SLOGAN', 'A melhor cafeteria da cidade');
define('EMPRESA_ENDERECO', 'Rua José Bonifacio, 1812');
define('EMPRESA_BAIRRO', 'Santa Casa');
define('EMPRESA_CIDADE', 'Goioerê');
define('EMPRESA_ESTADO', 'SP');
define('EMPRESA_CEP', '87360-000');
define('EMPRESA_TELEFONE', '(44) 9966-8963');
define('EMPRESA_EMAIL', 'contato@cafearoma.com.br');

// Horários de funcionamento
$horarios = [
    'segunda' => ['abertura' => '07:00', 'fechamento' => '22:00'],
    'terca' => ['abertura' => '07:00', 'fechamento' => '22:00'],
    'quarta' => ['abertura' => '07:00', 'fechamento' => '22:00'],
    'quinta' => ['abertura' => '07:00', 'fechamento' => '22:00'],
    'sexta' => ['abertura' => '07:00', 'fechamento' => '22:00'],
    'sabado' => ['abertura' => '08:00', 'fechamento' => '23:00'],
    'domingo' => ['abertura' => '08:00', 'fechamento' => '23:00']
];

// Configurações do site
define('SITE_TITULO', 'Café Aroma - A melhor cafeteria da cidade');
define('SITE_DESCRICAO', 'O melhor café da cidade, com grãos selecionados e ambiente acolhedor');
define('SITE_PALAVRAS_CHAVE', 'café, cafeteria, espresso, cappuccino, Goioerê, grãos especiais');
define('SITE_URL', 'https://cafearoma.com.br');

// Função para verificar se está aberto
function estaAberto() {
    global $horarios;
    
    $diaAtual = strtolower(date('l'));
    $diasPT = [
        'monday' => 'segunda',
        'tuesday' => 'terca',
        'wednesday' => 'quarta',
        'thursday' => 'quinta',
        'friday' => 'sexta',
        'saturday' => 'sabado',
        'sunday' => 'domingo'
    ];
    
    $diaPT = $diasPT[$diaAtual];
    $horaAtual = date('H:i');
    
    $abertura = $horarios[$diaPT]['abertura'];
    $fechamento = $horarios[$diaPT]['fechamento'];
    
    return ($horaAtual >= $abertura && $horaAtual <= $fechamento);
}

// Função para obter status atual
function getStatusAtual() {
    if (estaAberto()) {
        return [
            'status' => 'aberto',
            'mensagem' => 'Estamos abertos! Venha nos visitar.',
            'cor' => 'success'
        ];
    } else {
        return [
            'status' => 'fechado',
            'mensagem' => 'Estamos fechados no momento.',
            'cor' => 'danger'
        ];
    }
}

// Função para processar contato (simulação sem banco)
function processarContato($dados) {
    // Validar dados
    $erros = [];
    
    if (empty($dados['nome'])) {
        $erros[] = 'Nome é obrigatório';
    }
    
    if (empty($dados['email']) || !filter_var($dados['email'], FILTER_VALIDATE_EMAIL)) {
        $erros[] = 'E-mail válido é obrigatório';
    }
    
    if (empty($dados['telefone'])) {
        $erros[] = 'Telefone é obrigatório';
    }
    
    if (empty($dados['assunto'])) {
        $erros[] = 'Assunto é obrigatório';
    }
    
    if (empty($dados['mensagem'])) {
        $erros[] = 'Mensagem é obrigatória';
    }
    
    if (!empty($erros)) {
        return [
            'sucesso' => false,
            'erros' => $erros
        ];
    }
    
    // Salvar em arquivo (simulando banco de dados)
    $contato = [
        'id' => uniqid(),
        'nome' => filter_var($dados['nome'], FILTER_SANITIZE_STRING),
        'email' => filter_var($dados['email'], FILTER_SANITIZE_EMAIL),
        'telefone' => filter_var($dados['telefone'], FILTER_SANITIZE_STRING),
        'assunto' => filter_var($dados['assunto'], FILTER_SANITIZE_STRING),
        'mensagem' => filter_var($dados['mensagem'], FILTER_SANITIZE_STRING),
        'data' => isset($dados['data']) ? $dados['data'] : null,
        'hora' => isset($dados['hora']) ? $dados['hora'] : null,
        'newsletter' => isset($dados['newsletter']) ? true : false,
        'data_envio' => date('Y-m-d H:i:s'),
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'Desconhecido'
    ];
    
    // Salvar em arquivo JSON
    $arquivo = 'dados/contatos.json';
    $contatos = [];
    
    if (file_exists($arquivo)) {
        $contatos = json_decode(file_get_contents($arquivo), true) ?? [];
    }
    
    $contatos[] = $contato;
    
    // Criar diretório se não existir
    if (!is_dir('dados')) {
        mkdir('dados', 0755, true);
    }
    
    file_put_contents($arquivo, json_encode($contatos, JSON_PRETTY_PRINT));
    
    // Enviar email (simulação)
    enviarEmailNotificacao($contato);
    
    return [
        'sucesso' => true,
        'mensagem' => 'Contato enviado com sucesso! Responderemos em breve.'
    ];
}

// Função para enviar email (simulação)
function enviarEmailNotificacao($contato) {
    // Em um projeto real, aqui usaria mail() ou PHPMailer
    $assunto = "Novo contato - " . $contato['assunto'];
    $mensagem = "
    Novo contato recebido:
    
    Nome: {$contato['nome']}
    E-mail: {$contato['email']}
    Telefone: {$contato['telefone']}
    Assunto: {$contato['assunto']}
    
    Mensagem:
    {$contato['mensagem']}
    
    Data/Hora: {$contato['data_envio']}
    IP: {$contato['ip']}
    ";
    
    // Simular envio
    error_log("EMAIL SIMULADO: $assunto\n$mensagem");
    
    return true;
}

// Função para obter contatos (admin)
function obterContatos($limite = null) {
    $arquivo = 'dados/contatos.json';
    
    if (!file_exists($arquivo)) {
        return [];
    }
    
    $contatos = json_decode(file_get_contents($arquivo), true) ?? [];
    
    // Ordenar por data (mais recente primeiro)
    usort($contatos, function($a, $b) {
        return strtotime($b['data_envio']) - strtotime($a['data_envio']);
    });
    
    if ($limite) {
        return array_slice($contatos, 0, $limite);
    }
    
    return $contatos;
}

// Função para obter estatísticas
function obterEstatisticas() {
    $contatos = obterContatos();
    
    $stats = [
        'total_contatos' => count($contatos),
        'contatos_hoje' => 0,
        'contatos_semana' => 0,
        'contatos_mes' => 0,
        'assuntos_populares' => [],
        'horarios_pico' => []
    ];
    
    $hoje = date('Y-m-d');
    $semanaAtras = date('Y-m-d', strtotime('-7 days'));
    $mesAtras = date('Y-m-d', strtotime('-30 days'));
    
    $assuntos = [];
    $horas = [];
    
    foreach ($contatos as $contato) {
        $dataContato = date('Y-m-d', strtotime($contato['data_envio']));
        $horaContato = date('H', strtotime($contato['data_envio']));
        
        // Contar por período
        if ($dataContato === $hoje) {
            $stats['contatos_hoje']++;
        }
        
        if ($dataContato >= $semanaAtras) {
            $stats['contatos_semana']++;
        }
        
        if ($dataContato >= $mesAtras) {
            $stats['contatos_mes']++;
        }
        
        // Contar assuntos
        $assuntos[$contato['assunto']] = ($assuntos[$contato['assunto']] ?? 0) + 1;
        
        // Contar horários
        $horas[$horaContato] = ($horas[$horaContato] ?? 0) + 1;
    }
    
    // Top 3 assuntos
    arsort($assuntos);
    $stats['assuntos_populares'] = array_slice($assuntos, 0, 3, true);
    
    // Top 3 horários
    arsort($horas);
    $stats['horarios_pico'] = array_slice($horas, 0, 3, true);
    
    return $stats;
}

// Função para gerar dados para relatório
function gerarRelatorio($periodo = '30') {
    $contatos = obterContatos();
    $dataLimite = date('Y-m-d', strtotime("-{$periodo} days"));
    
    $contatosFiltrados = array_filter($contatos, function($contato) use ($dataLimite) {
        return date('Y-m-d', strtotime($contato['data_envio'])) >= $dataLimite;
    });
    
    return [
        'periodo' => $periodo . ' dias',
        'total' => count($contatosFiltrados),
        'contatos' => $contatosFiltrados,
        'gerado_em' => date('Y-m-d H:i:s')
    ];
}

// Verificar se é uma requisição AJAX
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['ajax'])) {
    header('Content-Type: application/json');
    
    switch ($_POST['acao']) {
        case 'contato':
            $resultado = processarContato($_POST);
            echo json_encode($resultado);
            break;
            
        case 'status':
            $status = getStatusAtual();
            echo json_encode($status);
            break;
            
        case 'horarios':
            global $horarios;
            echo json_encode($horarios);
            break;
            
        case 'stats':
            if (isset($_POST['admin']) && $_POST['admin'] === 'true') {
                $stats = obterEstatisticas();
                echo json_encode($stats);
            } else {
                echo json_encode(['erro' => 'Acesso negado']);
            }
            break;
            
        default:
            echo json_encode(['erro' => 'Ação não reconhecida']);
    }
    exit;
}

// Função para debug - mostrar informações do sistema
function debugInfo() {
    if (!isset($_GET['debug']) || $_GET['debug'] !== 'true') {
        return;
    }
    
    echo "<div style='background: #f8f9fa; padding: 20px; margin: 20px; border: 1px solid #dee2e6; border-radius: 5px;'>";
    echo "<h3>🔧 Informações de Debug</h3>";
    echo "<p><strong>Status:</strong> " . (estaAberto() ? '🟢 Aberto' : '🔴 Fechado') . "</p>";
    echo "<p><strong>Hora atual:</strong> " . date('H:i') . "</p>";
    echo "<p><strong>Dia atual:</strong> " . date('l (d/m/Y)') . "</p>";
    
    $stats = obterEstatisticas();
    echo "<p><strong>Total de contatos:</strong> " . $stats['total_contatos'] . "</p>";
    echo "<p><strong>Contatos hoje:</strong> " . $stats['contatos_hoje'] . "</p>";
    
    if (!empty($stats['assuntos_populares'])) {
        echo "<p><strong>Assuntos mais frequentes:</strong></p>";
        echo "<ul>";
        foreach ($stats['assuntos_populares'] as $assunto => $quantidade) {
            echo "<li>{$assunto}: {$quantidade} contatos</li>";
        }
        echo "</ul>";
    }
    echo "</div>";
}

// Mostrar debug se solicitado
debugInfo();
?>