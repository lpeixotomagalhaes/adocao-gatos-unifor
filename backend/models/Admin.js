const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true }, // Vai ser criptografada!
    dataCriacao: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', AdminSchema);