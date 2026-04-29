const mongoose = require('mongoose');

const GatoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sexo: { type: String, required: true },
    idade: { type: String, required: true },
    foto: { type: String }, // Guardaremos o link da imagem
    status: { 
        type: String, 
        enum: ['Disponível', 'Pendente', 'Adotado'], 
        default: 'Disponível' 
    },
    castrado: { type: Boolean, default: false },
    vacinado: { type: Boolean, default: false },
    fiv: { type: String, default: 'Negativo' },
    felv: { type: String, default: 'Negativo' },
    descricao: { type: String },
    dataCadastro: { type: Date, default: Date.now },
    // Campos para os seus gráficos da Dashboard futuramente:
    dataVacinacao: { type: Date },
    dataAdocao: { type: Date }
});

module.exports = mongoose.model('Gato', GatoSchema);