const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const cabecalho = req.header('Authorization');

    if (!cabecalho) {
        return res.status(401).json({ mensagem: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const tokenLimpo = cabecalho.replace('Bearer ', '');
        const decodificado = jwt.verify(tokenLimpo, process.env.JWT_SECRET);

        req.adminId = decodificado.id;
        req.adminNome = decodificado.nome;
        next();
    } catch (error) {
        res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
    }
};

module.exports = verificarToken;
