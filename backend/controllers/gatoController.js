const Gato = require('../models/Gato');
const Log = require('../models/Log');
const mongoose = require('mongoose');

// Função auxiliar para gerar Slugs únicos
const gerarSlug = async (nome) => {
    let slugBase = nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-');
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
        const dados = req.body;
        
        if (dados.nome) {
            dados.slug = await gerarSlug(dados.nome);
        }
        
        if (req.file) {
            dados.foto = `http://localhost:5000/uploads/${req.file.filename}`;
        }
        
        const novoGato = new Gato(dados);
        const gatoSalvo = await novoGato.save();

        if (dados.adminNome) {
            await new Log({ 
                adminNome: dados.adminNome, 
                acao: 'Cadastrou Gato', 
                detalhes: `Gato ${gatoSalvo.nome} foi registrado no sistema.` 
            }).save();
        }

        res.status(201).json(gatoSalvo);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao cadastrar gato', erro: error.message });
    }
};

const listarGatos = async (req, res) => {
    try {
        // Lista apenas quem está no campus (Disponível ou Pendente)
        const gatos = await Gato.find({ status: { $in: ['Disponível', 'Pendente', 'Adotado'] } }).sort({ dataCadastro: -1 });
        res.status(200).json(gatos);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar gatos', erro: error.message });
    }
};

const listarGatosArquivados = async (req, res) => {
    try {
        const gatos = await Gato.find({ status: 'Arquivado' }).sort({ dataArquivamento: -1 });
        res.status(200).json(gatos);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar gatos arquivados', erro: error.message });
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
        res.status(500).json({ mensagem: 'Erro ao buscar o gato', erro: error.message });
    }
};

// VERSÃO UNIFICADA: Edição completa com Foto, Slug e Auditoria
const atualizarGato = async (req, res) => {
    try {
        const dados = req.body;
        
        // Regra de data de adoção
        if (dados.status === 'Adotado' && !dados.dataAdocao) {
            dados.dataAdocao = new Date();
        }

        // Se uma nova foto foi enviada
        if (req.file) {
            dados.foto = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        // Se o nome mudou, gera novo slug
        if (dados.nome) {
            dados.slug = await gerarSlug(dados.nome);
        }

        const gatoAtualizado = await Gato.findByIdAndUpdate(req.params.id, dados, { new: true });
        
        if (!gatoAtualizado) return res.status(404).json({ mensagem: 'Gatinho não encontrado' });

        // Registro de Log
        if (dados.adminNome) {
            await new Log({ 
                adminNome: dados.adminNome, 
                acao: 'Editou Gato', 
                detalhes: `As informações do gato ${gatoAtualizado.nome} foram atualizadas.` 
            }).save();
        }

        res.status(200).json(gatoAtualizado);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao atualizar gato', erro: error.message });
    }
};

const arquivarGato = async (req, res) => {
    try {
        const { motivo, justificativa, adminNome } = req.body;
        const gato = await Gato.findById(req.params.id);
        
        if (!gato) return res.status(404).json({ mensagem: 'Gatinho não encontrado' });

        gato.status = 'Arquivado';
        gato.motivoArquivamento = motivo || 'Não informado';
        gato.justificativaArquivamento = justificativa || '';
        gato.arquivadoPor = adminNome || 'Admin Desconhecido';
        gato.dataArquivamento = new Date();
        
        await gato.save();

        await new Log({ 
            adminNome: gato.arquivadoPor, 
            acao: 'Arquivou Gato', 
            detalhes: `Gato ${gato.nome} removido por motivo: ${motivo}` 
        }).save();

        res.status(200).json({ mensagem: 'Gatinho arquivado com sucesso!' });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao arquivar gato', erro: error.message });
    }
};

const excluirGatoPermanente = async (req, res) => {
    try {
        const gatoDeletado = await Gato.findByIdAndDelete(req.params.id);
        
        if (!gatoDeletado) return res.status(404).json({ mensagem: 'Gatinho não encontrado' });

        const admin = req.query.adminNome || "Admin";
        await new Log({ 
            adminNome: admin, 
            acao: 'Excluiu Gato', 
            detalhes: `O registro do gato ${gatoDeletado.nome} foi removido permanentemente.` 
        }).save();

        res.status(200).json({ mensagem: 'Gatinho removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao deletar gato', erro: error.message });
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