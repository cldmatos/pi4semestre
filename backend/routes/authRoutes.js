const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

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

module.exports = router;
