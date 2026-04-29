const express = require('express');
const router = express.Router();
const gatoController = require('../controllers/gatoController');

// Define qual URL chama qual função do Controller
router.post('/', gatoController.criarGato);          // POST /api/gatos
router.get('/', gatoController.listarGatos);         // GET /api/gatos
router.get('/:id', gatoController.buscarGatoPorId);  // GET /api/gatos/12345
router.put('/:id', gatoController.atualizarGato);    // PUT /api/gatos/12345
router.delete('/:id', gatoController.deletarGato);   // DELETE /api/gatos/12345

module.exports = router;