const Gato = require('../models/Gato');
const Log = require('../models/Log');
const mongoose = require('mongoose');

const ehProducao = () => process.env.NODE_ENV === 'production';
const respostaErro = (res, status, mensagem, error) => {
    const corpo = { mensagem };
    if (!ehProducao() && error?.message) corpo.erro = error.message;
    return res.status(status).json(corpo);
};

const gerarSlug = async (nome) => {
    let slugBase = nome.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, '-');
    let slug = slugBase;
    let contador = 1;
    while (await Gato.findOne({ slug })) {
        slug = `${slugBase}-${contador}`;
        contador++;
    }
    return slug;
};

const criarGato = async (req, res) => {
    try {
        const { adminNome: _ignorado, ...dados } = req.body;

        if (dados.nome) {
            dados.slug = await gerarSlug(dados.nome);
        }

        if (req.file) {
            dados.foto = `/uploads/${req.file.filename}`;
        }

        const novoGato = new Gato(dados);
        const gatoSalvo = await novoGato.save();

        await new Log({
            adminNome: req.adminNome,
            acao: 'Cadastrou Gato',
            detalhes: `Gato ${gatoSalvo.nome} foi registrado no sistema.`
        }).save();

        res.status(201).json(gatoSalvo);
    } catch (error) {
        respostaErro(res, 500, 'Erro ao cadastrar gato', error);
    }
};

const listarGatos = async (req, res) => {
    try {
        const gatos = await Gato.find({ status: { $in: ['Disponível', 'Pendente', 'Adotado'] } }).sort({ dataCadastro: -1 });
        res.status(200).json(gatos);
    } catch (error) {
        respostaErro(res, 500, 'Erro ao buscar gatos', error);
    }
};

const listarGatosArquivados = async (req, res) => {
    try {
        const gatos = await Gato.find({ status: 'Arquivado' }).sort({ dataArquivamento: -1 });
        res.status(200).json(gatos);
    } catch (error) {
        respostaErro(res, 500, 'Erro ao buscar gatos arquivados', error);
    }
};

const buscarGatoPorId = async (req, res) => {
    try {
        const identificador = req.params.id;
        const ehIdValido = mongoose.Types.ObjectId.isValid(identificador);

        const gato = await Gato.findOne({ slug: identificador }) ||
            (ehIdValido ? await Gato.findById(identificador) : null);

        if (!gato) return res.status(404).json({ mensagem: 'Gatinho não encontrado' });

        res.status(200).json(gato);
    } catch (error) {
        respostaErro(res, 500, 'Erro ao buscar o gato', error);
    }
};

const atualizarGato = async (req, res) => {
    try {
        const { adminNome: _ignorado, ...dados } = req.body;

        if (dados.status === 'Adotado' && !dados.dataAdocao) {
            dados.dataAdocao = new Date();
        }

        if (req.file) {
            dados.foto = `/uploads/${req.file.filename}`;
        }

        if (dados.nome) {
            dados.slug = await gerarSlug(dados.nome);
        }

        const gatoAtualizado = await Gato.findByIdAndUpdate(req.params.id, dados, { new: true });

        if (!gatoAtualizado) return res.status(404).json({ mensagem: 'Gatinho não encontrado' });

        await new Log({
            adminNome: req.adminNome,
            acao: 'Editou Gato',
            detalhes: `As informações do gato ${gatoAtualizado.nome} foram atualizadas.`
        }).save();

        res.status(200).json(gatoAtualizado);
    } catch (error) {
        respostaErro(res, 500, 'Erro ao atualizar gato', error);
    }
};

const arquivarGato = async (req, res) => {
    try {
        const { motivo, justificativa } = req.body;
        const gato = await Gato.findById(req.params.id);

        if (!gato) return res.status(404).json({ mensagem: 'Gatinho não encontrado' });

        gato.status = 'Arquivado';
        gato.motivoArquivamento = motivo || 'Não informado';
        gato.justificativaArquivamento = justificativa || '';
        gato.arquivadoPor = req.adminNome;
        gato.dataArquivamento = new Date();

        await gato.save();

        await new Log({
            adminNome: req.adminNome,
            acao: 'Arquivou Gato',
            detalhes: `Gato ${gato.nome} removido por motivo: ${motivo}`
        }).save();

        res.status(200).json({ mensagem: 'Gatinho arquivado com sucesso!' });
    } catch (error) {
        respostaErro(res, 500, 'Erro ao arquivar gato', error);
    }
};

const excluirGatoPermanente = async (req, res) => {
    try {
        const gatoDeletado = await Gato.findByIdAndDelete(req.params.id);

        if (!gatoDeletado) return res.status(404).json({ mensagem: 'Gatinho não encontrado' });

        await new Log({
            adminNome: req.adminNome,
            acao: 'Excluiu Gato',
            detalhes: `O registro do gato ${gatoDeletado.nome} foi removido permanentemente.`
        }).save();

        res.status(200).json({ mensagem: 'Gatinho removido com sucesso!' });
    } catch (error) {
        respostaErro(res, 500, 'Erro ao deletar gato', error);
    }
};

module.exports = {
    criarGato,
    listarGatos,
    listarGatosArquivados,
    buscarGatoPorId,
    atualizarGato,
    arquivarGato,
    excluirGatoPermanente
};
