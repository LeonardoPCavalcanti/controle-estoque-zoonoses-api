const express = require('express');
const router = express.Router();

const EntradaController = require('../controllers/EntradaEstoqueController');
const autenticarToken = require('../middleware/authMiddleware');
const autorizarRoles = require('../middleware/roleMiddleware');

router.get('/', autenticarToken, EntradaController.listar);
router.get('/:id', autenticarToken, EntradaController.buscarPorId);

router.post('/', autenticarToken, autorizarRoles('admin', 'operador'), EntradaController.criar);
router.delete('/:id', autenticarToken, autorizarRoles('admin'), EntradaController.deletar);

module.exports = router;
