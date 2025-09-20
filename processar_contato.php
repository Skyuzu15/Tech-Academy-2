<?php
// ===== PROCESSAMENTO DE CONTATO =====
// Arquivo: processar_contato.php

// Incluir configurações
require_once 'config.php';

// Definir cabeçalho para JSON
header('Content-Type: application/json');

// Verificar método de requisição
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'sucesso' => false,
        'erro' => 'Método não permitido'
    ]);
    exit;
}

// Verificar se é requisição AJAX
$isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
          strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

try {
    // Coletar dados do formulário
    $dados = [
        'nome' => $_POST['nome'] ?? '',
        'email' => $_POST['email'] ?? '',
        'telefone' => $_POST['telefone'] ?? '',
        'assunto' => $_POST['assunto'] ?? '',
        'mensagem' => $_POST['mensagem'] ?? '',
        'data' => $_POST['data'] ?? null,
        'hora' => $_POST['hora'] ?? null,
        'newsletter' => isset($_POST['newsletter'])
    ];
    
    // Processar contato usando função do config.php
    $resultado = processarContato($dados);
    
    if ($resultado['sucesso']) {
        // Log de sucesso
        error_log("Contato processado com sucesso: " . $dados['email']);
        
        // Resposta de sucesso
        $response = [
            'sucesso' => true,
            'mensagem' => $resultado['mensagem'],
            'dados' => [
                'nome' => $dados['nome'],
                'timestamp' => date('Y-m-d H:i:s')
            ]
        ];
        
        // Se não for AJAX, redirecionar
        if (!$isAjax) {
            header('Location: index.php?contato=sucesso');
            exit;
        }
        
    } else {
        // Log de erro
        error_log("Erro ao processar contato: " . implode(', ', $resultado['erros']));
        
        // Resposta de erro
        $response = [
            'sucesso' => false,
            'erros' => $resultado['erros'],
            'mensagem' => 'Por favor, corrija os erros indicados.'
        ];
        
        // Se não for AJAX, redirecionar
        if (!$isAjax) {
            $erros = implode('|', $resultado['erros']);
            header('Location: index.php?contato=erro&msg=' . urlencode($erros));
            exit;
        }
    }
    
} catch (Exception $e) {
    // Log de erro crítico
    error_log("Erro crítico no processamento de contato: " . $e->getMessage());
    
    $response = [
        'sucesso' => false,
        'erro' => 'Erro interno do servidor. Tente novamente mais tarde.',
        'codigo' => 500
    ];
    
    http_response_code(500);
    
    // Se não for AJAX, redirecionar
    if (!$isAjax) {
        header('Location: index.php?contato=erro&msg=' . urlencode('Erro interno do servidor'));
        exit;
    }
}

// Retornar resposta JSON
echo json_encode($response, JSON_PRETTY_PRINT);

// Função para sanitizar dados (extra)
function sanitizarDados($dados) {
    $dadosLimpos = [];
    
    foreach ($dados as $chave => $valor) {
        if (is_string($valor)) {
            // Remover tags HTML e espaços extras
            $valor = strip_tags(trim($valor));
            
            // Sanitização específica por campo
            switch ($chave) {
                case 'email':
                    $dadosLimpos[$chave] = filter_var($valor, FILTER_SANITIZE_EMAIL);
                    break;
                    
                case 'telefone':
                    $dadosLimpos[$chave] = preg_replace('/[^0-9()\-\s]/', '', $valor);
                    break;
                    
                case 'nome':
                    $dadosLimpos[$chave] = preg_replace('/[^a-zA-ZÀ-ÿ\s]/', '', $valor);
                    break;
                    
                default:
                    $dadosLimpos[$chave] = filter_var($valor, FILTER_SANITIZE_STRING);
            }
        } else {
            $dadosLimpos[$chave] = $valor;
        }
    }
    
    return $dadosLimpos;
}

// Função para validar dados específicos
function validarDadosExtendida($dados) {
    $erros = [];
    
    // Validar nome (mínimo 2 palavras)
    if (!empty($dados['nome'])) {
        $palavras = explode(' ', trim($dados['nome']));
        if (count($palavras) < 2) {
            $erros[] = 'Por favor, informe nome e sobrenome';
        }
    }
    
    // Validar telefone (formato brasileiro)
    if (!empty($dados['telefone'])) {
        $telefone = preg_replace('/\D/', '', $dados['telefone']);
        if (strlen($telefone) < 10 || strlen($telefone) > 11) {
            $erros[] = 'Telefone deve ter 10 ou 11 dígitos';
        }
    }
    
    // Validar mensagem (mínimo 10 caracteres)
    if (!empty($dados['mensagem']) && strlen($dados['mensagem']) < 10) {
        $erros[] = 'Mensagem deve ter pelo menos 10 caracteres';
    }
    
    // Validar data (não pode ser no passado)
    if (!empty($dados['data'])) {
        $dataInformada = strtotime($dados['data']);
        $hoje = strtotime(date('Y-m-d'));
        
        if ($dataInformada < $hoje) {
            $erros[] = 'Data de preferência não pode ser no passado';
        }
    }
    
    return $erros;
}

// Rate limiting simples (prevenir spam)
function verificarRateLimit() {
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $arquivo = 'dados/rate_limit.json';
    $limite = 5; // 5 tentativas
    $janela = 300; // 5 minutos
    
    $agora = time();
    $tentativas = [];
    
    if (file_exists($arquivo)) {
        $tentativas = json_decode(file_get_contents($arquivo), true) ?? [];
    }
    
    // Limpar tentativas antigas
    $tentativas = array_filter($tentativas, function($timestamp) use ($agora, $janela) {
        return ($agora - $timestamp) < $janela;
    });
    
    // Verificar limite para este IP
    $tentativasIP = array_filter($tentativas, function($data) use ($ip) {
        return $data['ip'] === $ip;
    });
    
    if (count($tentativasIP) >= $limite) {
        return false;
    }
    
    // Registrar esta tentativa
    $tentativas[] = [
        'ip' => $ip,
        'timestamp' => $agora
    ];
    
    // Salvar
    if (!is_dir('dados')) {
        mkdir('dados', 0755, true);
    }
    
    file_put_contents($arquivo, json_encode($tentativas));
    
    return true;
}
?>