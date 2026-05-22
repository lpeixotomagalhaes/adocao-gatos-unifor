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

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const TAMANHO_MAXIMO = 5 * 1024 * 1024;

const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, path.join(__dirname, '..', 'uploads')); },
    filename: function (req, file, cb) {
        const safeExt = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '');
        cb(null, `${Date.now()}${safeExt}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (!TIPOS_PERMITIDOS.includes(file.mimetype)) {
        return cb(new Error('Tipo de arquivo não permitido. Envie uma imagem JPG, PNG, WEBP ou GIF.'));
    }
    cb(null, true);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: TAMANHO_MAXIMO, files: 1 } });

const tratarErroUpload = (err, req, res, next) => {
    if (err) return res.status(400).json({ mensagem: err.message });
    next();
};

router.post('/', authMiddleware, upload.single('foto'), tratarErroUpload, criarGato);
router.get('/', listarGatos);
router.get('/arquivados', authMiddleware, listarGatosArquivados);
router.get('/:id', buscarGatoPorId);
router.put('/:id', authMiddleware, upload.single('foto'), tratarErroUpload, atualizarGato);
router.put('/:id/arquivar', authMiddleware, arquivarGato);
router.delete('/:id', authMiddleware, excluirGatoPermanente);

module.exports = router;
