const Admin = require('../models/Admin');
const Gato = require('../models/Gato');
const Formulario = require('../models/Formulario');
const Log = require('../models/Log');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ehProducao = () => process.env.NODE_ENV === 'production';
const respostaErro = (res, status, mensagem, error) => {
    const corpo = { mensagem };
    if (!ehProducao() && error?.message) corpo.erro = error.message;
    return res.status(status).json(corpo);
};

const criarAdmin = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ mensagem: 'Nome, e-mail e senha são obrigatórios.' });
        }
        if (senha.length < 8) {
            return res.status(400).json({ mensagem: 'A senha precisa ter ao menos 8 caracteres.' });
        }

        const jaExiste = await Admin.findOne({ email });
        if (jaExiste) {
            return res.status(409).json({ mensagem: 'Já existe um administrador com este e-mail.' });
        }

        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        const novoAdmin = new Admin({ nome, email, senha: senhaCriptografada });
        await novoAdmin.save();

        res.status(201).json({ mensagem: 'Administrador criado com sucesso!' });
    } catch (error) {
        respostaErro(res, 500, 'Erro ao criar admin', error);
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

        await new Log({ adminId: admin._id, adminNome: admin.nome, acao: 'Login', detalhes: 'Acessou o painel de administração' }).save();

        res.status(200).json({ mensagem: 'Login realizado com sucesso', token, admin: { nome: admin.nome, email: admin.email } });
    } catch (error) {
        respostaErro(res, 500, 'Erro no login', error);
    }
};

const obterPerfil = async (req, res) => {
    try {
        const admin = await Admin.findById(req.adminId).select('-senha');
        if (!admin) return res.status(404).json({ mensagem: 'Admin não encontrado.' });
        res.status(200).json({ nome: admin.nome, email: admin.email });
    } catch (error) {
        respostaErro(res, 500, 'Erro ao buscar perfil', error);
    }
};

const obterDashboard = async (req, res) => {
    try {
        const totalGatos = await Gato.countDocuments({ status: { $ne: 'Arquivado' } });
        const gatosAdotados = await Gato.countDocuments({ status: 'Adotado' });
        const gatosDisponiveis = await Gato.countDocuments({ status: 'Disponível' });
        const formulariosPendentes = await Formulario.countDocuments({ statusAnalise: 'Pendente' });

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
        respostaErro(res, 500, 'Erro ao carregar dashboard', error);
    }
};

const obterHistoricoLogs = async (req, res) => {
    try {
        const pagina = Math.max(parseInt(req.query.pagina, 10) || 1, 1);
        const limite = Math.min(Math.max(parseInt(req.query.limite, 10) || 50, 1), 200);
        const pular = (pagina - 1) * limite;

        const [logs, total] = await Promise.all([
            Log.find().sort({ data: -1 }).skip(pular).limit(limite),
            Log.countDocuments(),
        ]);

        res.status(200).json({
            logs,
            paginacao: { pagina, limite, total, paginas: Math.ceil(total / limite) },
        });
    } catch (error) {
        respostaErro(res, 500, 'Erro ao buscar histórico', error);
    }
};

module.exports = { criarAdmin, loginAdmin, obterDashboard, obterHistoricoLogs, obterPerfil };
