const Formulario = require('../models/Formulario');
const Log = require('../models/Log');

const enviarFormulario = async (req, res) => {
    try {
        const novoFormulario = new Formulario(req.body);
        const formularioSalvo = await novoFormulario.save();
        res.status(201).json({ mensagem: 'Formulário enviado com sucesso!', formulario: formularioSalvo });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao enviar formulário', erro: error.message });
    }
};

const listarFormularios = async (req, res) => {
    try {
        const formularios = await Formulario.find().populate('gatoId', 'nome foto status').sort({ dataEnvio: -1 });
        res.status(200).json(formularios);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar formulários', erro: error.message });
    }
};

const atualizarStatusFormulario = async (req, res) => {
    try {
        const { statusAnalise, adminNome } = req.body;
        
        const formularioAtualizado = await Formulario.findByIdAndUpdate(
            req.params.id, 
            { statusAnalise: statusAnalise }, 
            { new: true }
        ).populate('gatoId');

        // REGISTRA O LOG
        if (adminNome) {
            const acao = statusAnalise === 'Aprovado' ? 'Aprovou Adoção' : 'Reprovou Adoção';
            await new Log({ adminNome, acao, detalhes: `Solicitação de ${formularioAtualizado.nomeCandidato} para o gato ${formularioAtualizado.gatoId?.nome || 'N/A'}` }).save();
        }

        res.status(200).json(formularioAtualizado);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao atualizar status', erro: error.message });
    }
};

// NOVA FUNÇÃO: Adicionar notas de acompanhamento do adotante
const adicionarNotaAcompanhamento = async (req, res) => {
    try {
        const { nota, adminNome } = req.body;
        const formulario = await Formulario.findById(req.params.id);
        
        if (!formulario) return res.status(404).json({ mensagem: 'Formulário não encontrado' });

        formulario.notasAcompanhamento.push({ nota, adminNome, data: new Date() });
        await formulario.save();

        await new Log({ adminNome, acao: 'Adicionou Nota', detalhes: `Nova nota no acompanhamento de ${formulario.nomeCandidato}` }).save();

        res.status(200).json({ mensagem: 'Nota adicionada com sucesso!', formulario });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao adicionar nota', erro: error.message });
    }
};

module.exports = { enviarFormulario, listarFormularios, atualizarStatusFormulario, adicionarNotaAcompanhamento };