const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado ao MongoDB Atlas');
  } catch (error) {
    console.error('❌ Erro na conexão com MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
