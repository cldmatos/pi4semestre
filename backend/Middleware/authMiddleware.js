const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // Verifica se o cabeçalho de autorização está presente e segue o formato esperado
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Token não fornecido ou formato inválido' });
  }

  // Extrai o token, ignorando a palavra "Bearer "
  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token inválido' });
    
    // Salva os dados decodificados do usuário na requisição para uso posterior
    req.user = decoded;
    next();
  });
};
