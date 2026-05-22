const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const conectarBD = require('./config/db');

dotenv.config();
conectarBD();

const app = express();

const origensPermitidas = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (origensPermitidas.includes(origin)) return callback(null, true);
        return callback(null, false);
    },
    credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

const gatoRotas = require('./routes/gatoRoutes');
const adminRotas = require('./routes/adminRoutes');
const formRotas = require('./routes/formRoutes');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/gatos', gatoRotas);
app.use('/api/admin', adminRotas);
app.use('/api/formularios', formRotas);

app.get('/', (req, res) => {
    res.send('API do Resgatinhos Unifor está rodando! 🐾');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor voando na porta ${PORT}`);
});
