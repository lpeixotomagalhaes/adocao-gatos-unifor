const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
// O middleware será importado depois para bloquear as rotas privadas
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', formController.enviarFormulario); // Público
router.get('/', authMiddleware, formController.listarFormularios); // Protegido
router.put('/:id', authMiddleware, formController.atualizarStatusFormulario); // Protegido

module.exports = router;