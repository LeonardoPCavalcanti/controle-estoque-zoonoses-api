const express = require('express');
const router = express.Router();

const SaidaController = require('../controllers/SaidaEstoqueController');
const autenticarToken = require('../middleware/authMiddleware');
const autorizarRoles = require('../middleware/roleMiddleware');

router.get('/', autenticarToken, SaidaController.listar);
router.get('/:id', autenticarToken, SaidaController.buscarPorId);

router.post('/', autenticarToken, autorizarRoles('admin', 'operador'), SaidaController.criar);
router.delete('/:id', autenticarToken, autorizarRoles('admin'), SaidaController.deletar);

module.exports = router;
