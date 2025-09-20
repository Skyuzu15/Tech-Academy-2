<?php
// Incluir configurações PHP se disponível
if (file_exists('config.php')) {
    include_once 'config.php';
    
    // Verificar se há mensagens de status
    $mensagem_status = '';
    if (isset($_GET['contato'])) {
        if ($_GET['contato'] === 'sucesso') {
            $mensagem_status = '<div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="bi bi-check-circle-fill me-2"></i>
                <strong>Mensagem enviada com sucesso!</strong> Obrigado pelo contato, responderemos em breve.
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>';
        } elseif ($_GET['contato'] === 'erro') {
            $erro_msg = isset($_GET['msg']) ? urldecode($_GET['msg']) : 'Erro ao enviar mensagem.';
            $mensagem_status = '<div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <strong>Erro:</strong> ' . htmlspecialchars($erro_msg) . '
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo defined('SITE_TITULO') ? SITE_TITULO : 'Café Aroma - A melhor cafeteria da cidade'; ?></title>
    
    <!-- Meta tags para SEO -->
    <meta name="description" content="<?php echo defined('SITE_DESCRICAO') ? SITE_DESCRICAO : 'O melhor café da cidade, com grãos selecionados e ambiente acolhedor para você e sua família.'; ?>">
    <meta name="keywords" content="<?php echo defined('SITE_PALAVRAS_CHAVE') ? SITE_PALAVRAS_CHAVE : 'café, cafeteria, espresso, cappuccino, Goioerê, grãos especiais'; ?>">
    <meta name="author" content="Café Aroma">
    
    <!-- Open Graph -->
    <meta property="og:title" content="<?php echo defined('SITE_TITULO') ? SITE_TITULO : 'Café Aroma - A melhor cafeteria da cidade'; ?>">
    <meta property="og:description" content="<?php echo defined('SITE_DESCRICAO') ? SITE_DESCRICAO : 'O melhor café da cidade, com grãos selecionados e ambiente acolhedor'; ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo defined('SITE_URL') ? SITE_URL : '#'; ?>">
    
    <!-- Bootstrap CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.1/font/bootstrap-icons.min.css">
    <!-- CSS Personalizado -->
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- Toast Container -->
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1060;"></div>

    <!-- Mensagem de Status (se houver) -->
    <?php if (!empty($mensagem_status)) echo $mensagem_status; ?>

    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
        <div class="container">
            <a class="navbar-brand fw-bold" href="#home">
                <i class="bi bi-cup-hot-fill me-2 text-primary"></i>
                <?php echo defined('EMPRESA_NOME') ? EMPRESA_NOME : 'Café Aroma'; ?>
            </a>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link active" href="#home">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#sobre">Quem Somos</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#produtos">Produtos</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#localizacao">Localização</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#contato">Contato</a>
                    </li>
                </ul>
            </div>