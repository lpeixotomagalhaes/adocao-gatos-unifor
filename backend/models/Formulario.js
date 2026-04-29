const mongoose = require('mongoose');

const FormularioSchema = new mongoose.Schema({
    // O ref: 'Gato' avisa o banco que esse ID pertence à coleção de gatos
    gatoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gato', required: true },
    nomeCandidato: { type: String, required: true },
    vinculoUnifor: { type: String, required: true },
    idade: { type: Number, required: true },
    telefone: { type: String, required: true },
    tipoMoradia: { type: String, required: true },
    possuiTelas: { type: String, required: true },
    motivoAdocao: { type: String, required: true },
    statusAnalise: { 
        type: String, 
        enum: ['Pendente', 'Aprovado', 'Reprovado'], 
        default: 'Pendente' 
    },
    dataEnvio: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Formulario', FormularioSchema);