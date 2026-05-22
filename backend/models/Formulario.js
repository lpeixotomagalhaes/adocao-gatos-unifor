const mongoose = require('mongoose');

const FormularioSchema = new mongoose.Schema({
    gatoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gato', required: true },

    // Dados pessoais
    nomeCandidato: { type: String, required: true },
    email: { type: String },
    telefone: { type: String, required: true },
    vinculoUnifor: { type: String, required: true },

    // Endereço
    cep: { type: String },
    rua: { type: String },
    numero: { type: String },
    complemento: { type: String },
    bairro: { type: String },
    cidade: { type: String },
    estado: { type: String },

    // Sobre o lar
    tipoMoradia: { type: String, required: true },
    telasProtecao: { type: String },
    outrosAnimais: { type: String },
    rotinaGato: { type: String },

    // Termos aceitos
    custos: { type: Boolean, default: false },
    interno: { type: Boolean, default: false },

    statusAnalise: {
        type: String,
        enum: ['Pendente', 'Aprovado', 'Reprovado'],
        default: 'Pendente'
    },

    notasAcompanhamento: [{
        data: { type: Date, default: Date.now },
        nota: { type: String },
        adminNome: { type: String }
    }],

    dataEnvio: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Formulario', FormularioSchema);
