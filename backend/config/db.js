const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const conectarBD = async () => {
    try {
        // Tenta conectar usando a URL do arquivo .env
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        
        console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Erro ao conectar ao MongoDB: ${error.message}`);
        process.exit(1); // Fecha o servidor se não conseguir conectar
    }
};

module.exports = conectarBD;