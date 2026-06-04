const db = require('../database/db');

const SuperAdmin = {
  findAll: () => db.query('SELECT * FROM superadmin'),
  findById: (id) =>
    db.query('SELECT * FROM superadmin WHERE idSuperAdmin = ?', [id]),
  findByUsuario: (idU) =>
    db.query('SELECT * FROM superadmin WHERE usuario_idusuario = ?', [idU]),
  create: (data) => db.query(
    'INSERT INTO superadmin (nome, usuario_idusuario) VALUES (?,?)',
    [data.nome, data.usuario_idusuario]
  ),
  update: (id, data) => db.query(
    'UPDATE superadmin SET nome=? WHERE idSuperAdmin=?',
    [data.nome, id]
  ),
  delete: (id) =>
    db.query('DELETE FROM superadmin WHERE idSuperAdmin = ?', [id])
};

module.exports = SuperAdmin;