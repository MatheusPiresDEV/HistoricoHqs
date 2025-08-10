const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// Rota para salvar histórico de leitura concluída
router.post('/historico', async (req, res) => {
  try {
    const { nome, tipo, dataInicio, dataConclusao, paginas, resumo } = req.body;
    // Crie um novo item ou histórico conforme seu modelo
    const novoHistorico = new Item({
      nome,
      tipo,
      data: dataInicio,
      dataConclusao,
      paginas,
      resumo,
      status: 'Lido'
    });
    await novoHistorico.save();
    res.status(201).json({ message: 'Histórico salvo com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar histórico.' });
  }
});

module.exports = router;
