const express = require('express');
const router = express.Router();
const { enviarFormulario, listarFormularios, atualizarStatusFormulario, adicionarNotaAcompanhamento } = require('../controllers/formController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', enviarFormulario);
router.get('/', authMiddleware, listarFormularios);
router.put('/:id', authMiddleware, atualizarStatusFormulario);
router.put('/:id/notas', authMiddleware, adicionarNotaAcompanhamento); // NOVA ROTA

module.exports = router;