const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const conectarBD = require('./config/db');

// Importando as Rotas
const gatoRotas = require('./routes/gatoRoutes');
const adminRotas = require('./routes/adminRoutes'); // NOVA
const formRotas = require('./routes/formRoutes');   // NOVA
// 1. Carregar variáveis de ambiente
dotenv.config();

// 2. Conectar ao Banco de Dados
conectarBD();

const app = express();

// 3. Middlewares
app.use(cors());
app.use(express.json());

// 4. Rotas da API
app.use('/api/gatos', gatoRotas);
app.use('/api/admin', adminRotas);       // NOVA
app.use('/api/formularios', formRotas);  // NOVA
// Rota de teste inicial
app.get('/', (req, res) => {
    res.send('API do Resgatinhos Unifor está rodando! 🐾');
});

// 5. Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor voando na porta ${PORT}`);
});