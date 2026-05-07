const db = require('../database/db');

const Coordenador = {
  findAll: () => db.query('SELECT * FROM coordenador'),
  findById: (id) =>
    db.query('SELECT * FROM coordenador WHERE idCoordenador = ?', [id]),
  create: (data) => db.query(
    'INSERT INTO coordenador (nome, usuario_idusuario, telefone, email) VALUES (?,?,?,?)',
    [data.nome, data.usuario_idusuario, data.telefone, data.email]
  ),
  update: (id, data) => db.query(
    'UPDATE coordenador SET nome=?, telefone=?, email=? WHERE idCoordenador=?',
    [data.nome, data.telefone, data.email, id]
  ),
  delete: (id) =>
    db.query('DELETE FROM coordenador WHERE idCoordenador = ?', [id]),
  getCursos: (id) => db.query(
    `SELECT c.* FROM curso c
      JOIN coordenador_curso cc ON c.idCurso = cc.curso_idCurso
      WHERE cc.coordenador_idCoordenador = ?`, [id]
  ),
  addCurso: (id, idCurso) => db.query(
    'INSERT INTO coordenador_curso VALUES (?,?)', [id, idCurso]
  ),
  removeCurso: (id, idCurso) => db.query(
    'DELETE FROM coordenador_curso WHERE coordenador_idCoordenador=? AND curso_idCurso=?',
    [id, idCurso]
  ),
  removeTodosCursos: (id) =>
    db.query('DELETE FROM coordenador_curso WHERE coordenador_idCoordenador = ?', [id])
};

module.exports = Coordenador;