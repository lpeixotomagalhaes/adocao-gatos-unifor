const Gato = require('../models/Gato');
const mongoose = require('mongoose');

// Função para gerar URL amigável (Slug)
const gerarSlug = async (nome) => {
    let slugBase = nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-');
    let slug = slugBase;
    let contador = 1;
    // Verifica se já existe, se sim, adiciona número
    while (await Gato.findOne({ slug })) {
        slug = `${slugBase}-${contador}`;
        contador++;
    }
    return slug;
};

// 1. CADASTRAR UM NOVO GATO
const criarGato = async (req, res) => {
    try {
        const dados = req.body;
        if (dados.nome) {
            dados.slug = await gerarSlug(dados.nome);
        }
        
        const novoGato = new Gato(dados);
        const gatoSalvo = await novoGato.save();
        res.status(201).json(gatoSalvo);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao cadastrar gato', erro: error.message });
    }
};

// 2. LISTAR TODOS OS GATOS
const listarGatos = async (req, res) => {
    try {
        const gatos = await Gato.find().sort({ dataCadastro: -1 });
        res.status(200).json(gatos);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar gatos', erro: error.message });
    }
};

// 3. BUSCAR UM GATO ESPECÍFICO (Agora busca por SLUG ou ID)
const buscarGatoPorId = async (req, res) => {
    try {
        const identificador = req.params.id;
        const ehIdValido = mongoose.Types.ObjectId.isValid(identificador);
        
        // Tenta buscar pelo nome na URL (slug). Se não achar, tenta pelo ID antigo.
        const gato = await Gato.findOne({ slug: identificador }) || 
                     (ehIdValido ? await Gato.findById(identificador) : null);
                     
        if (!gato) return res.status(404).json({ mensagem: 'Gatinho não encontrado' });
        
        res.status(200).json(gato);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar o gato', erro: error.message });
    }
};

// 4. ATUALIZAR DADOS DO GATO
const atualizarGato = async (req, res) => {
    try {
        if (req.body.status === 'Adotado' && !req.body.dataAdocao) {
            req.body.dataAdocao = new Date();
        }
        // Se o nome mudar, atualiza o slug também
        if (req.body.nome) {
            req.body.slug = await gerarSlug(req.body.nome);
        }

        const gatoAtualizado = await Gato.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!gatoAtualizado) return res.status(404).json({ mensagem: 'Gatinho não encontrado' });
        
        res.status(200).json(gatoAtualizado);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao atualizar gato', erro: error.message });
    }
};

// 5. DELETAR UM GATO
const deletarGato = async (req, res) => {
    try {
        const gatoDeletado = await Gato.findByIdAndDelete(req.params.id);
        if (!gatoDeletado) return res.status(404).json({ mensagem: 'Gatinho não encontrado' });
        res.status(200).json({ mensagem: 'Gatinho removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao deletar gato', erro: error.message });
    }
};

module.exports = { criarGato, listarGatos, buscarGatoPorId, atualizarGato, deletarGato };