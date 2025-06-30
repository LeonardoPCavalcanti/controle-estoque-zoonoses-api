const express = require('express');
const router = express.Router();

const SetorController = require('../controllers/SetorController');
const autenticarToken = require('../middleware/authMiddleware');
const autorizarRoles = require('../middleware/roleMiddleware');

// Rotas protegidas
router.get('/', autenticarToken, SetorController.listar);
router.get('/:id', autenticarToken, SetorController.buscarPorId);

router.post('/', autenticarToken, autorizarRoles('admin'), SetorController.criar);
router.put('/:id', autenticarToken, autorizarRoles('admin'), SetorController.atualizar);
router.delete('/:id', autenticarToken, autorizarRoles('admin'), SetorController.deletar);

module.exports = router;
