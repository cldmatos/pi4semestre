require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes'); // Rota de autenticação
const app = express();

app.use(cors()); // Permite requisições de outros domínios
app.use(bodyParser.json());

// Conexão com o MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao MongoDB'))
.catch((error) => console.error('Erro ao conectar ao MongoDB:', error));

const db = mongoose.connection;
let collection;

// Defina a coleção `medidas` após a conexão ser estabelecida
db.once('open', () => {
  collection = db.collection("medidas");
  console.log("Coleção 'medidas' inicializada");
});

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Rota para buscar dados de temperatura ou umidade
app.get('/api/data', async (req, res) => {
  try {
    const type = req.query.type;
    let query = {};

    if (type === 'temperature') {
      query = { mediaTemp: { $exists: true } };
    } else if (type === 'humidity') {
      query = { mediaUmid: { $exists: true } };
    }

    if (!collection) {
      return res.status(500).json({ message: "Coleção não inicializada" });
    }

    const data = await collection.find(query).toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar dados: " + error.message });
  }
});

// Porta do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
