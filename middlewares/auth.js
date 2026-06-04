const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token não informado' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token inválido' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token expirado ou inválido' });
  }
};

exports.autorizar = (...perfis) => (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token não informado' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token inválido' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    if (!perfis.includes(decoded.tipo_usuario)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token expirado ou inválido' });
  }
};

exports.apenasProprioAluno = [verificarToken, (req, res, next) => {
  const { tipo_usuario, matricula } = req.usuario;
  if (tipo_usuario === 'superadmin' || tipo_usuario === 'coordenador') return next();
  if (String(matricula) === String(req.params.matricula)) return next();
  return res.status(403).json({ message: 'Acesso negado ao recurso de outro aluno' });
}];

exports.apenasProprioUsuario = [verificarToken, (req, res, next) => {
  const { tipo_usuario, idusuario } = req.usuario;
  if (tipo_usuario === 'superadmin') return next();
  if (String(idusuario) === String(req.params.id)) return next();
  return res.status(403).json({ message: 'Acesso negado' });
}];

exports.apenasProprioCoordenador = [verificarToken, (req, res, next) => {
  const { tipo_usuario, idCoordenador } = req.usuario;
  if (tipo_usuario === 'superadmin') return next();
  if (String(idCoordenador) === String(req.params.id)) return next();
  return res.status(403).json({ message: 'Acesso negado' });
}];