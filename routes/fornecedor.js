const express = require('express');
const router = express.Router();

const FornecedorController = require('../controllers/FornecedorController');
const autenticarToken = require('../middleware/authMiddleware');
const autorizarRoles = require('../middleware/roleMiddleware');

router.get('/', autenticarToken, FornecedorController.listar);
router.get('/:id', autenticarToken, FornecedorController.buscarPorId);

router.post('/', autenticarToken, autorizarRoles('admin'), FornecedorController.criar);
router.put('/:id', autenticarToken, autorizarRoles('admin'), FornecedorController.atualizar);
router.delete('/:id', autenticarToken, autorizarRoles('admin'), FornecedorController.deletar);

module.exports = router;
