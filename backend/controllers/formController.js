const mongoose = require('mongoose');
const Formulario = require('../models/Formulario');
const Gato = require('../models/Gato');
const Log = require('../models/Log');

const ehProducao = () => process.env.NODE_ENV === 'production';
const respostaErro = (res, status, mensagem, error) => {
    const corpo = { mensagem };
    if (!ehProducao() && error?.message) corpo.erro = error.message;
    return res.status(status).json(corpo);
};

const enviarFormulario = async (req, res) => {
    try {
        const { gatoId } = req.body;

        if (!gatoId || !mongoose.Types.ObjectId.isValid(gatoId)) {
            return res.status(400).json({ mensagem: 'gatoId inválido.' });
        }

        const gato = await Gato.findById(gatoId);
        if (!gato) {
            return res.status(404).json({ mensagem: 'Gatinho não encontrado.' });
        }
        if (gato.status === 'Adotado' || gato.status === 'Arquivado') {
            return res.status(409).json({ mensagem: 'Este gato não está mais disponível para adoção.' });
        }

        const novoFormulario = new Formulario(req.body);
        const formularioSalvo = await novoFormulario.save();
        res.status(201).json({ mensagem: 'Formulário enviado com sucesso!', formulario: formularioSalvo });
    } catch (error) {
        respostaErro(res, 500, 'Erro ao enviar formulário', error);
    }
};

const listarFormularios = async (req, res) => {
    try {
        const formularios = await Formulario.find().populate('gatoId', 'nome foto status').sort({ dataEnvio: -1 });
        res.status(200).json(formularios);
    } catch (error) {
        respostaErro(res, 500, 'Erro ao buscar formulários', error);
    }
};

const atualizarStatusFormulario = async (req, res) => {
    try {
        const { statusAnalise } = req.body;

        const formularioAtualizado = await Formulario.findByIdAndUpdate(
            req.params.id,
            { statusAnalise },
            { new: true }
        ).populate('gatoId');

        if (!formularioAtualizado) {
            return res.status(404).json({ mensagem: 'Formulário não encontrado.' });
        }

        const acao = statusAnalise === 'Aprovado' ? 'Aprovou Adoção' : 'Reprovou Adoção';
        await new Log({
            adminNome: req.adminNome,
            acao,
            detalhes: `Solicitação de ${formularioAtualizado.nomeCandidato} para o gato ${formularioAtualizado.gatoId?.nome || 'N/A'}`
        }).save();

        res.status(200).json(formularioAtualizado);
    } catch (error) {
        respostaErro(res, 500, 'Erro ao atualizar status', error);
    }
};

const adicionarNotaAcompanhamento = async (req, res) => {
    try {
        const { nota } = req.body;
        const formulario = await Formulario.findById(req.params.id);

        if (!formulario) return res.status(404).json({ mensagem: 'Formulário não encontrado' });

        formulario.notasAcompanhamento.push({ nota, adminNome: req.adminNome, data: new Date() });
        await formulario.save();

        await new Log({
            adminNome: req.adminNome,
            acao: 'Adicionou Nota',
            detalhes: `Nova nota no acompanhamento de ${formulario.nomeCandidato}`
        }).save();

        res.status(200).json({ mensagem: 'Nota adicionada com sucesso!', formulario });
    } catch (error) {
        respostaErro(res, 500, 'Erro ao adicionar nota', error);
    }
};

module.exports = { enviarFormulario, listarFormularios, atualizarStatusFormulario, adicionarNotaAcompanhamento };
