const mongoose = require('mongoose');



const itemSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: String,
  preco: { type: Number, required: true },
  tipo: { type: String, enum: ['Livro', 'HQ', 'Outro'], required: true },
  status: { type: String, enum: ['Lido', 'Não lido', 'Em andamento', 'A comprar', 'Comprei'], default: 'Não lido' },
  comprado: { type: Boolean, default: false },
  imagem: { type: String }, // URL ou base64
  dataAdicao: { type: Date },
  dataCompra: { type: Date },
  tempoCompra: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
