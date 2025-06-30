const express = require('express');
const router = express.Router();

const CategoriaController = require('../controllers/CategoriaController');
const autenticarToken = require('../middleware/authMiddleware');
const autorizarRoles = require('../middleware/roleMiddleware');

router.get('/', autenticarToken, CategoriaController.listar);
router.get('/:id', autenticarToken, CategoriaController.buscarPorId);

router.post('/', autenticarToken, autorizarRoles('admin'), CategoriaController.criar);
router.put('/:id', autenticarToken, autorizarRoles('admin'), CategoriaController.atualizar);
router.delete('/:id', autenticarToken, autorizarRoles('admin'), CategoriaController.deletar);

module.exports = router;
