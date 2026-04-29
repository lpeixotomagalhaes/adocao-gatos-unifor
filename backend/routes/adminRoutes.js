const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/registrar', adminController.criarAdmin); // Usaremos no Insomnia para criar sua conta
router.post('/login', adminController.loginAdmin);
router.get('/dashboard', authMiddleware, adminController.obterDashboard); // Protegida!

module.exports = router;