const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    // O token geralmente é enviado pelo Frontend no cabeçalho (Header)
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ mensagem: 'Acesso negado. Token não fornecido.' });
    }

    try {
        // Remove a palavra "Bearer " se ela vier junto com o token
        const tokenLimpo = token.replace('Bearer ', '');
        
        // Verifica se o token é válido usando a senha do arquivo .env
        const decodificado = jwt.verify(tokenLimpo, process.env.JWT_SECRET);
        
        req.adminId = decodificado.id; // Guarda o ID do admin para usar nas rotas
        next(); // Deixa a pessoa passar para a próxima rota
    } catch (error) {
        res.status(400).json({ mensagem: 'Token inválido ou expirado.' });
    }
};

module.exports = verificarToken;