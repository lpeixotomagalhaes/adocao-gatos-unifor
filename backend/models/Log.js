const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    // Mudamos o tipo de ObjectId para String. Assim ele aceita qualquer formato e não trava!
    adminId: { type: String }, 
    adminNome: { type: String, required: true },
    acao: { type: String, required: true }, 
    detalhes: { type: String }, 
    data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', LogSchema);