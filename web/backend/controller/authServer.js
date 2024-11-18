const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Novo: biblioteca para JWT
require('dotenv').config();

const authApp = express();
const port = process.env.AUTH_PORT || 5001;

authApp.use(cors());
authApp.use(express.json());

let userCollection;

// Conexão ao MongoDB
const uri = process.env.MONGO_URI || "mongodb+srv://claudiomatos:UcVJJeY2lMpu69Cm@arduino.hxqx1.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect()
  .then(() => {
    console.log("Conectado ao MongoDB!");
    const database = client.db("arduino");
    userCollection = database.collection("users");
  })
  .catch(err => console.error("Erro ao conectar:", err));

// Rota de Login com o novo caminho
authApp.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Confirme que a coleção está definida
    if (!userCollection) {
      return res.status(500).json({ message: "Coleção de usuários não inicializada" });
    }

    // Busca o usuário pelo email
    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Usuário ou senha incorretos" });
    }

    // Verifica a senha com bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Usuário ou senha incorretos" });
    }

    // Gera o token JWT
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: "Login bem-sucedido", token });
  } catch (error) {
    res.status(500).json({ message: "Erro no login: " + error.message });
  }
});

// Middleware de autenticação JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ message: "Token não fornecido" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token inválido" });

    req.user = decoded; // Decodifica o usuário e passa para as próximas funções
    next();
  });
};

// Rota protegida
authApp.get('/api/auth/dados-protegidos', authMiddleware, (req, res) => {
  // Apenas acessível com token válido
  res.json({ message: "Dados acessados com sucesso!", user: req.user });
});

// Rota de Registro
authApp.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserção no banco
    const newUser = { name, email, password: hashedPassword };
    await userCollection.insertOne(newUser);

    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar usuário: " + error.message });
  }
});

authApp.listen(port, () => {
  console.log(`Auth server rodando em http://localhost:${port}`);
});
