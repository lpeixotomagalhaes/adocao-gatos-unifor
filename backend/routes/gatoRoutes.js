const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
    criarGato, 
    listarGatos, 
    listarGatosArquivados, 
    buscarGatoPorId, 
    atualizarGato, 
    arquivarGato,
    excluirGatoPermanente 
} = require('../controllers/gatoController');
const authMiddleware = require('../middlewares/authMiddleware');

const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, 'uploads/'); },
    filename: function (req, file, cb) { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage: storage });

router.post('/', authMiddleware, upload.single('foto'), criarGato);
router.get('/', listarGatos);
router.get('/arquivados', authMiddleware, listarGatosArquivados);
router.get('/:id', buscarGatoPorId);

// ROTA DE EDIÇÃO: Agora aceita PUT e processa a foto opcional
router.put('/:id', authMiddleware, upload.single('foto'), atualizarGato);

router.put('/:id/arquivar', authMiddleware, arquivarGato);

// NOVA ROTA: Exclusão definitiva
router.delete('/:id', authMiddleware, excluirGatoPermanente);

module.exports = router;