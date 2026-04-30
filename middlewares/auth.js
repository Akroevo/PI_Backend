exports.autorizar = (...perfis) => (req, res, next) => {
  const tipo = req.headers['perfil'];
  if (!tipo) return res.status(401).json({ message: 'Perfil não informado' });
  if (!perfis.includes(tipo)) return res.status(403).json({ message: 'Acesso negado' });
  req.usuario = {
    tipo_usuario: tipo,
    idusuario: req.headers['userid'],
    matricula: req.headers['matricula'] || null
  };
  next();
};

exports.apenasProprioAluno = (req, res, next) => {
  const tipo = req.headers['perfil'];
  const matricula = req.headers['matricula'];
  if (tipo === 'superadmin' || tipo === 'coordenador') return next();
  if (String(matricula) === String(req.params.matricula)) return next();
  return res.status(403).json({ message: 'Acesso negado ao recurso de outro aluno' });
};

exports.apenasProprioUsuario = (req, res, next) => {
  const tipo = req.headers['perfil'];
  const id   = req.headers['userid'];
  if (tipo === 'superadmin') return next();
  if (String(id) === String(req.params.id)) return next();
  return res.status(403).json({ message: 'Acesso negado' });
};