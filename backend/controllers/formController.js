const Formulario = require('../models/Formulario');

// Criar novo formulário (Público - qualquer pessoa pode enviar)
const enviarFormulario = async (req, res) => {
    try {
        const novoFormulario = new Formulario(req.body);
        const formularioSalvo = await novoFormulario.save();
        res.status(201).json({ mensagem: 'Formulário enviado com sucesso!', formulario: formularioSalvo });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao enviar formulário', erro: error.message });
    }
};

// Listar todos os formulários (Privado - só o Admin vê)
const listarFormularios = async (req, res) => {
    try {
        // O .populate('gatoId') traz os dados do gato junto com o formulário!
        const formularios = await Formulario.find().populate('gatoId', 'nome foto status').sort({ dataEnvio: -1 });
        res.status(200).json(formularios);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar formulários', erro: error.message });
    }
};

// Atualizar status do formulário (Ex: Aprovar adoção)
const atualizarStatusFormulario = async (req, res) => {
    try {
        const formularioAtualizado = await Formulario.findByIdAndUpdate(
            req.params.id, 
            { statusAnalise: req.body.statusAnalise }, 
            { new: true }
        );
        res.status(200).json(formularioAtualizado);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao atualizar status', erro: error.message });
    }
};

module.exports = { enviarFormulario, listarFormularios, atualizarStatusFormulario };