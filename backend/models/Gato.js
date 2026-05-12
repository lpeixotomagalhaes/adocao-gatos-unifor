const mongoose = require('mongoose');

const GatoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sexo: { type: String, required: true },
    idade: { type: String, required: true },
    foto: { type: String }, 
    status: { 
        type: String, 
        enum: ['Disponível', 'Pendente', 'Adotado', 'Arquivado'], // Adicionado Arquivado
        default: 'Disponível' 
    },
    castrado: { type: Boolean, default: false },
    vacinado: { type: Boolean, default: false },
    fiv: { type: String, default: 'Negativo' },
    felv: { type: String, default: 'Negativo' },
    descricao: { type: String },
    dataCadastro: { type: Date, default: Date.now },
    
    // CAMPOS DE ARQUIVAMENTO (Soft Delete)
    motivoArquivamento: { type: String },
    justificativaArquivamento: { type: String },
    arquivadoPor: { type: String }, // Nome de quem arquivou
    dataArquivamento: { type: Date },

    dataVacinacao: { type: Date },
    dataAdocao: { type: Date },
    slug: { type: String, unique: true },
});

module.exports = mongoose.model('Gato', GatoSchema);