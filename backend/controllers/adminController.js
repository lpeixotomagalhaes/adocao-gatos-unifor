const Admin = require('../models/Admin');
const Gato = require('../models/Gato');
const Formulario = require('../models/Formulario');
const Log = require('../models/Log');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

const loginAdmin = async (req, res) => {
    try {
        const { email, senha } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ mensagem: 'E-mail ou senha incorretos' });

        const senhaValida = await bcrypt.compare(senha, admin.senha);
        if (!senhaValida) return res.status(400).json({ mensagem: 'E-mail ou senha incorretos' });

        const token = jwt.sign({ id: admin._id, nome: admin.nome }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // SALVA O LOG DE ACESSO
        await new Log({ adminId: admin._id, adminNome: admin.nome, acao: 'Login', detalhes: 'Acessou o painel de administração' }).save();

        res.status(200).json({ mensagem: 'Login realizado com sucesso', token, admin: { nome: admin.nome, email: admin.email } });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro no login', erro: error.message });
    }
};

const obterDashboard = async (req, res) => {
    try {
        // 1. Contagens dos Cards Principais
        const totalGatos = await Gato.countDocuments({ status: { $ne: 'Arquivado' } }); 
        const gatosAdotados = await Gato.countDocuments({ status: 'Adotado' });
        const gatosDisponiveis = await Gato.countDocuments({ status: 'Disponível' });
        const formulariosPendentes = await Formulario.countDocuments({ statusAnalise: 'Pendente' });

        // 2. Cálculo Real de Saúde (Castrados e Vacinados)
        const saudeStats = await Gato.aggregate([
            { $match: { status: { $ne: 'Arquivado' } } },
            {
                $group: {
                    _id: null,
                    castrados: { $sum: { $cond: ["$castrado", 1, 0] } },
                    naoCastrados: { $sum: { $cond: ["$castrado", 0, 1] } },
                    vacinados: { $sum: { $cond: ["$vacinado", 1, 0] } },
                    naoVacinados: { $sum: { $cond: ["$vacinado", 0, 1] } }
                }
            }
        ]);

        const saude = saudeStats[0] || { castrados: 0, naoCastrados: 0, vacinados: 0, naoVacinados: 0 };

        // 3. Gráfico de Evolução (Adotados, Castrados e Vacinados por Mês - Últimos 6 meses)
        const seisMesesAtras = new Date();
        seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 5);
        seisMesesAtras.setDate(1);

        const evolucaoMensal = await Gato.aggregate([
            { $match: { dataCadastro: { $gte: seisMesesAtras }, status: { $ne: 'Arquivado' } } },
            {
                $group: {
                    _id: { month: { $month: "$dataCadastro" }, year: { $year: "$dataCadastro" } },
                    adotados: { $sum: { $cond: [{ $eq: ["$status", "Adotado"] }, 1, 0] } },
                    castrados: { $sum: { $cond: ["$castrado", 1, 0] } },
                    vacinados: { $sum: { $cond: ["$vacinado", 1, 0] } }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Transformando os números dos meses em nomes (Jan, Fev, etc.) para o Gráfico
        const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const graficoAdocoes = evolucaoMensal.map(item => ({
            mes: mesesNomes[item._id.month - 1],
            adotados: item.adotados,
            castrados: item.castrados,
            vacinados: item.vacinados
        }));

        res.status(200).json({
            totalGatos,
            gatosAdotados,
            gatosDisponiveis,
            formulariosPendentes,
            saude,
            graficoAdocoes 
        });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao carregar dashboard', erro: error.message });
    }
};

const obterHistoricoLogs = async (req, res) => {
    try {
        const logs = await Log.find().sort({ data: -1 }).limit(100); 
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar histórico', erro: error.message });
    }
};

module.exports = { criarAdmin, loginAdmin, obterDashboard, obterHistoricoLogs };