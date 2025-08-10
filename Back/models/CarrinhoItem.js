const mongoose = require('mongoose');
const carrinhoItemSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  tipo: { type: String, enum: ['Livro', 'HQ', 'Outro'], required: true },
  imagem: String,
  valor: { type: Number, required: true },
  status: { type: String, enum: ['A comprar', 'Comprei'], default: 'A comprar' },
  dataAdicao: { type: Date, default: Date.now },
  dataCompra: Date,
  tempoCompra: String
}, { timestamps: true });
module.exports = mongoose.model('CarrinhoItem', carrinhoItemSchema);
