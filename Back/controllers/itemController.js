const Item = require('../models/Item');

exports.getAllItems = async (req, res) => {
  const items = await Item.find();
  res.json(items);
};

exports.getItemById = async (req, res) => {
  const item = await Item.findById(req.params.id);
  res.json(item);
};


exports.createItem = async (req, res) => {
  try {
    const data = req.body;
    // Garante datas corretas
    if (!data.dataAdicao) data.dataAdicao = new Date();
    const newItem = new Item(data);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (e) {
    res.status(400).json({ error: 'Erro ao criar item', details: e.message });
  }
};


exports.updateItem = async (req, res) => {
  try {
    const data = req.body;
    // Garante datas corretas
    if (data.dataCompra && typeof data.dataCompra === 'string') {
      data.dataCompra = new Date(data.dataCompra);
    }
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(updatedItem);
  } catch (e) {
    res.status(400).json({ error: 'Erro ao atualizar item', details: e.message });
  }
};

exports.deleteItem = async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: 'Item deletado com sucesso' });
};
