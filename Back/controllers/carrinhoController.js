const CarrinhoItem = require('../models/CarrinhoItem');
exports.getAll = async (req, res) => {
  try {
    const itens = await CarrinhoItem.find();
    res.json(itens);
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao buscar itens do carrinho' });
  }
};
exports.create = async (req, res) => {
  try {
    const item = new CarrinhoItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (e) {
    res.status(400).json({ erro: 'Erro ao criar item', detalhes: e.message });
  }
};
exports.update = async (req, res) => {
  try {
    const updated = await CarrinhoItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ erro: 'Erro ao atualizar item', detalhes: e.message });
  }
};
exports.delete = async (req, res) => {
  try {
    await CarrinhoItem.findByIdAndDelete(req.params.id);
    res.json({ mensagem: 'Item removido do carrinho' });
  } catch (e) {
    res.status(400).json({ erro: 'Erro ao remover item', detalhes: e.message });
  }
};
