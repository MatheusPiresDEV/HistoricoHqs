
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const itemRoutes = require('./routes/itemRoutes');
const carrinhoRoutes = require('./routes/carrinhoRoutes');
const estatisticasRoutes = require('./routes/estatisticasRoutes');
const authRoutes = require('./routes/authRoutes');
const historicoRoutes = require('./routes/historicoRoutes');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(cors()); // permite requisições do frontend
app.use(express.json());

app.use('/api/items', itemRoutes);
app.use('/api/carrinho', carrinhoRoutes);
app.use('/api/estatisticas', estatisticasRoutes);
app.use('/api', authRoutes);
app.use('/api', historicoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
