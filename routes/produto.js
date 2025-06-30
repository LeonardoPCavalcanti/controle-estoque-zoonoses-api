const express = require('express');
const router = express.Router();

const ProdutoController = require('../controllers/ProdutoController');
const autenticarToken = require('../middleware/authMiddleware');
const autorizarRoles = require('../middleware/roleMiddleware');

router.get('/', autenticarToken, ProdutoController.listar);
router.get('/:id', autenticarToken, ProdutoController.buscarPorId);

router.post('/', autenticarToken, autorizarRoles('admin'), ProdutoController.criar);
router.put('/:id', autenticarToken, autorizarRoles('admin'), ProdutoController.atualizar);
router.delete('/:id', autenticarToken, autorizarRoles('admin'), ProdutoController.deletar);

module.exports = router;
