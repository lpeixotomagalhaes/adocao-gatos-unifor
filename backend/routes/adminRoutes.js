const express = require('express');
const router = express.Router();
const { criarAdmin, loginAdmin, obterDashboard, obterHistoricoLogs, obterPerfil } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/registro', authMiddleware, criarAdmin);
router.post('/login', loginAdmin);
router.get('/me', authMiddleware, obterPerfil);
router.get('/dashboard', authMiddleware, obterDashboard);
router.get('/logs', authMiddleware, obterHistoricoLogs);

module.exports = router;
