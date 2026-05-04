const Admin = require('../models/Admin');
const Gato = require('../models/Gato');
const Formulario = require('../models/Formulario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Criar primeiro Admin
const criarAdmin = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        const novoAdmin = new Admin({ nome, email, senha: senhaCriptografada });
        await novoAdmin.save();
        
        res.status(201).json({ mensagem: 'Administrador criado com sucesso!' });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao criar admin', erro: error.message });
    }
};

// Login do Admin
const loginAdmin = async (req, res) => {
    try {
        const { email, senha } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ mensagem: 'E-mail ou senha incorretos' });

        const senhaValida = await bcrypt.compare(senha, admin.senha);
        if (!senhaValida) return res.status(400).json({ mensagem: 'E-mail ou senha incorretos' });

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ mensagem: 'Login realizado com sucesso', token, admin: { nome: admin.nome, email: admin.email } });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro no login', erro: error.message });
    }
};

// Buscar Dados da Dashboard
const obterDashboard = async (req, res) => {
    try {
        // Conta as estatísticas no banco
        const totalGatos = await Gato.countDocuments();
        const gatosAdotados = await Gato.countDocuments({ status: 'Adotado' });
        const gatosDisponiveis = await Gato.countDocuments({ status: 'Disponível' });
        const formulariosPendentes = await Formulario.countDocuments({ statusAnalise: 'Pendente' });

        // Lógica do Gráfico: Meses passados simulados + Mês atual com dados reais
        const graficoAdocoes = [
            { mes: 'Fev', adotados: 2 },
            { mes: 'Mar', adotados: 5 },
            { mes: 'Abr', adotados: 4 },
            { mes: 'Mai', adotados: gatosAdotados } // <-- MÊS ATUAL LIGADO AO BANCO
        ];

        res.status(200).json({
            totalGatos,
            gatosAdotados,
            gatosDisponiveis,
            formulariosPendentes,
            graficoAdocoes // Enviando o gráfico para o React
        });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao carregar dashboard', erro: error.message });
    }
};

module.exports = { criarAdmin, loginAdmin, obterDashboard };