
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Mock simples de itens do carrinho (pode ser substituído por banco depois)
const carrinho = [
	{ id: 1, titulo: 'HQ Exemplo 1', quantidade: 2, preco: 20 },
	{ id: 2, titulo: 'HQ Exemplo 2', quantidade: 1, preco: 35 }
];

// GET /api/media-precos - retorna a média dos preços dos itens do carrinho
app.get('/api/media-precos', (req, res) => {
	if (carrinho.length === 0) {
		return res.json({ media: 0 });
	}
	const soma = carrinho.reduce((acc, item) => acc + (item.preco || 0), 0);
	const media = soma / carrinho.length;
	res.json({ media });
});

// DELETE /api/carrinho/:id - remove item do carrinho
app.delete('/api/carrinho/:id', (req, res) => {
	// senha pode ser enviada via body (fetch/axios) ou query
	const senha = req.body && req.body.senha ? req.body.senha : req.query.senha;
	if (senha !== '123456') {
		return res.status(401).json({ error: 'Senha inválida.' });
	}
	const id = parseInt(req.params.id);
	const index = carrinho.findIndex(i => i.id === id);
	if (index === -1) {
		return res.status(404).json({ error: 'Item não encontrado no carrinho.' });
	}
	const removido = carrinho.splice(index, 1)[0];
	res.json({ message: 'Item removido com sucesso', item: removido });
});

// PUT /api/carrinho/:id - altera o status de um item do carrinho (A comprar ↔ Comprei)
app.put('/api/carrinho/:id', (req, res) => {
	const senha = req.body.senha;
	if (senha !== '123456') {
		return res.status(401).json({ error: 'Senha inválida.' });
	}
	const id = parseInt(req.params.id);
	const item = carrinho.find(i => i.id === id);
	if (!item) {
		return res.status(404).json({ error: 'Item não encontrado no carrinho.' });
	}
	// Alterna o status
	if (!item.status || item.status === 'A comprar') {
		item.status = 'Comprei';
	} else {
		item.status = 'A comprar';
	}
	res.json(item);
});

// POST /api/carrinho - adiciona novo item ao carrinho
app.post('/api/carrinho', (req, res) => {
	const novoItem = req.body;
	if (!novoItem || !novoItem.titulo || !novoItem.quantidade || !novoItem.preco) {
		return res.status(400).json({ error: 'Dados do item incompletos.' });
	}
	// Validação: imagemLink XOR imagemUpload
	const temImagemLink = !!novoItem.imagemLink;
	const temImagemUpload = !!novoItem.imagemUpload;
	if ((temImagemLink && temImagemUpload) || (!temImagemLink && !temImagemUpload)) {
		return res.status(400).json({ error: 'Envie apenas imagem via link OU upload, não ambos e nem nenhum.' });
	}
	novoItem.id = carrinho.length ? carrinho[carrinho.length - 1].id + 1 : 1;
	carrinho.push(novoItem);
	res.status(201).json(novoItem);
});

// Conexão com o MongoDB
mongoose.connect('mongodb://localhost:27017/hqs', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const hqSchema = new mongoose.Schema({
	titulo: String,
	autor: String,
	ano: Number,
	preco: Number
});

const Hq = mongoose.model('Hq', hqSchema);

// CREATE
app.post('/hqs', async (req, res) => {
	try {
		const hq = new Hq(req.body);
		await hq.save();
		res.status(201).json(hq);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// READ ALL
app.get('/hqs', async (req, res) => {
	try {
		const hqs = await Hq.find();
		res.json(hqs);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// READ ONE
app.get('/hqs/:id', async (req, res) => {
	try {
		const hq = await Hq.findById(req.params.id);
		if (!hq) return res.status(404).json({ error: 'HQ não encontrada' });
		res.json(hq);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// UPDATE
app.put('/hqs/:id', async (req, res) => {
	try {
		const hq = await Hq.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!hq) return res.status(404).json({ error: 'HQ não encontrada' });
		res.json(hq);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});




// GET /api/carrinho - lista itens do carrinho com filtros e ordenação
app.get('/api/carrinho', (req, res) => {
	let resultado = [...carrinho];
	const { pesquisa, tipo, status, ordenar } = req.query;

	if (pesquisa) {
		resultado = resultado.filter(item =>
			item.titulo && item.titulo.toLowerCase().includes(pesquisa.toLowerCase())
		);
	}
	if (tipo) {
		resultado = resultado.filter(item =>
			item.tipo && item.tipo.toLowerCase() === tipo.toLowerCase()
		);
	}
	if (status) {
		resultado = resultado.filter(item =>
			item.status && item.status.toLowerCase() === status.toLowerCase()
		);
	}
	if (ordenar === 'maior') {
		resultado.sort((a, b) => (b.preco || 0) - (a.preco || 0));
	} else if (ordenar === 'menor') {
		resultado.sort((a, b) => (a.preco || 0) - (b.preco || 0));
	}
	res.json(resultado);
});

// DELETE
app.delete('/hqs/:id', async (req, res) => {
	try {
		const hq = await Hq.findByIdAndDelete(req.params.id);
		if (!hq) return res.status(404).json({ error: 'HQ não encontrada' });
		res.json({ message: 'HQ removida com sucesso' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});

