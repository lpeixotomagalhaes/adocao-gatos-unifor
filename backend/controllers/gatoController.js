const Gato = require('../models/Gato');

// 1. CADASTRAR UM NOVO GATO (Create)
const criarGato = async (req, res) => {
    try {
        const novoGato = new Gato(req.body);
        const gatoSalvo = await novoGato.save();
        res.status(201).json(gatoSalvo);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao cadastrar gato', erro: error.message });
    }
};

// 2. LISTAR TODOS OS GATOS (Read)
const listarGatos = async (req, res) => {
    try {
        // Busca todos os gatos, ordenando pelos mais recentes
        const gatos = await Gato.find().sort({ dataCadastro: -1 });
        res.status(200).json(gatos);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar gatos', erro: error.message });
    }
};

// 3. BUSCAR UM GATO ESPECÍFICO PELO ID (Read)
const buscarGatoPorId = async (req, res) => {
    try {
        const gato = await Gato.findById(req.params.id);
        if (!gato) return res.status(404).json({ mensagem: 'Gatinho não encontrado' });
        
        res.status(200).json(gato);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar o gato', erro: error.message });
    }
};

// 4. ATUALIZAR DADOS DO GATO (Update - Ex: Mudar status para 'Adotado')
const atualizarGato = async (req, res) => {
    try {
        // Se o status mudar para 'Adotado', podemos registrar a data automaticamente
        if (req.body.status === 'Adotado' && !req.body.dataAdocao) {
            req.body.dataAdocao = new Date();
        }

        const gatoAtualizado = await Gato.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } // Retorna o gato já com as informações novas
        );

        if (!gatoAtualizado) return res.status(404).json({ mensagem: 'Gatinho não encontrado' });
        
        res.status(200).json(gatoAtualizado);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao atualizar gato', erro: error.message });
    }
};

// 5. DELETAR UM GATO (Delete)
const deletarGato = async (req, res) => {
    try {
        const gatoDeletado = await Gato.findByIdAndDelete(req.params.id);
        if (!gatoDeletado) return res.status(404).json({ mensagem: 'Gatinho não encontrado' });
        
        res.status(200).json({ mensagem: 'Gatinho removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao deletar gato', erro: error.message });
    }
};

module.exports = {
    criarGato,
    listarGatos,
    buscarGatoPorId,
    atualizarGato,
    deletarGato
};