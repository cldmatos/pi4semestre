const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Medida = require('../models/Medida'); // Importa o modelo Medida
const jwt = require('jsonwebtoken');

// Função para gerar o token JWT
function generateToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Rota de registro
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'Usuário já registrado' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = generateToken(user);
    res.status(201).json({ message: 'Usuário registrado com sucesso', token });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar usuário', error });
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const token = generateToken(user);
    res.status(200).json({ message: 'Login bem-sucedido', token });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login', error });
  }
});

// Rota para verificar o token
router.get('/verify-token', (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ message: 'Token válido', userId: verified.id });
  } catch (error) {
    res.status(400).json({ message: 'Token inválido' });
  }
});

// Rota para comparar as medidas (id: 1 e id: 2)
router.get('/compare', async (req, res) => {
  try {
    const medida1 = await Medida.findOne({ id: 1 });
    const medida2 = await Medida.findOne({ id: 2 });

    if (!medida1 || !medida2) {
      return res.status(404).json({ message: 'Medições não encontradas' });
    }

    res.json({
      mediaTemp: {
        medida1: medida1.mediaTemp,
        medida2: medida2.mediaTemp,
      },
      desvioPTemp: {
        medida1: medida1.desvioPTemp,
        medida2: medida2.desvioPTemp,
      },
      // Adicione aqui outros campos de interesse, como coeficienteVTemp, mediaUmid, etc.
      
      // Inclua os arrays completos de temperaturas e umidades
      temperaturas: {
        medida1: medida1.temperaturas,
        medida2: medida2.temperaturas,
      },
      umidades: {
        medida1: medida1.umidades,
        medida2: medida2.umidades,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar comparações', error });
  }
});

module.exports = router;
