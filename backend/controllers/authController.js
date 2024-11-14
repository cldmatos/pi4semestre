
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({ name: req.body.name, email: req.body.email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ id: user._id }, 'secretkey', { expiresIn: '1h' });
    res.status(201).json({ message: 'Usuário registrado com sucesso', token });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign({ id: user._id }, 'secretkey', { expiresIn: '1h' });
      res.status(200).json({ message: 'Login bem-sucedido', token });
    } else {
      res.status(401).json({ message: 'Credenciais inválidas' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro no login' });
  }
};
