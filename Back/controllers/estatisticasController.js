const Item = require('../models/Item');
const CarrinhoItem = require('../models/CarrinhoItem');
exports.getEstatisticas = async (req, res) => {
  try {
    const totalItens = await Item.countDocuments();
    const totalCarrinho = await CarrinhoItem.countDocuments();
    const totalComprados = await CarrinhoItem.countDocuments({ status: 'Comprei' });
    const totalNaoComprados = await CarrinhoItem.countDocuments({ status: 'A comprar' });
    const somaValores = await CarrinhoItem.aggregate([
      { $group: { _id: null, total: { $sum: "$valor" } } }
    ]);
    res.json({
      totalItens,
      totalCarrinho,
      totalComprados,
      totalNaoComprados,
      totalGasto: somaValores[0] ? somaValores[0].total : 0
    });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao calcular estatísticas' });
  }
};
