const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const conectarBD = require('./config/db');

// 1. Configurações iniciais e Banco
dotenv.config();
conectarBD();

// 2. Inicializa o APP (Isso tem que vir ANTES de qualquer app.use)
const app = express();

// 3. Middlewares Globais
app.use(cors());
app.use(express.json());

// 4. Importação das Rotas
const gatoRotas = require('./routes/gatoRoutes');
const adminRotas = require('./routes/adminRoutes');
const formRotas = require('./routes/formRoutes');

// 5. Torna a pasta UPLOADS acessível
// Agora que o 'app' existe, podemos usar ele aqui
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 6. Definição das Rotas da API
app.use('/api/gatos', gatoRotas);
app.use('/api/admin', adminRotas);
app.use('/api/formularios', formRotas);

// Rota de teste
app.get('/', (req, res) => {
    res.send('API do Resgatinhos Unifor está rodando! 🐾');
});

// 7. Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor voando na porta ${PORT}`);
});