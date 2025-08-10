const express = require('express');
const router = express.Router();
const carrinhoController = require('../controllers/carrinhoController');
router.get('/', carrinhoController.getAll);
router.post('/', carrinhoController.create);
router.put('/:id', carrinhoController.update);
router.delete('/:id', carrinhoController.delete);
module.exports = router;
