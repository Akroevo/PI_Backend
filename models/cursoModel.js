const db = require('../database/db');

const Curso = {
  findAll: () => db.query('SELECT * FROM curso'),
  findById: (id) =>
    db.query('SELECT * FROM curso WHERE idCurso = ?', [id]),
  create: (data) => db.query(
    'INSERT INTO curso (nome, tipoCurso, cargaHorariaTotal, categoria) VALUES (?,?,?,?)',
    [data.nome, data.tipoCurso, data.cargaHorariaTotal, data.categoria]
  ),
  update: (id, data) => db.query(
    'UPDATE curso SET nome=?, tipoCurso=?, cargaHorariaTotal=?, categoria=? WHERE idCurso=?',
    [data.nome, data.tipoCurso, data.cargaHorariaTotal, data.categoria, id]
  ),
  delete: (id) =>
    db.query('DELETE FROM curso WHERE idCurso = ?', [id])
};

module.exports = Curso;