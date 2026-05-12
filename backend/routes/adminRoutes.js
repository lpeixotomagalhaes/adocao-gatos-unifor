const express = require('express');
const router = express.Router();
const { criarAdmin, loginAdmin, obterDashboard, obterHistoricoLogs } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/registro', criarAdmin);
router.post('/login', loginAdmin);
router.get('/dashboard', authMiddleware, obterDashboard);
router.get('/logs', authMiddleware, obterHistoricoLogs); // NOVA ROTA

module.exports = router;