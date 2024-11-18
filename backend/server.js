const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let collection;

// Conexão ao MongoDB
const uri = process.env.MONGO_URI || "mongodb+srv://claudiomatos:UcVJJeY2lMpu69Cm@arduino.hxqx1.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect()
  .then(() => {
    console.log("Conectado ao MongoDB!");
    const database = client.db("arduino"); // Corrigido para "arduino"
    collection = database.collection("medidas"); // Corrigido para "medidas"
  })
  .catch(err => {
    console.error("Erro ao conectar ao MongoDB:", err);
  });

// Rota para buscar todos os dados (filtra por tipo)
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
    console.log("Dados retornados:", data); // Verifique se está retornando dados
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar dados: " + error.message });
  }
});


// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
