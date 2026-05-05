const db = require('../database/db');

const Curso = {
  findAll: () => db.query('SELECT * FROM curso'),
  findById: (id) =>
    db.query('SELECT * FROM curso WHERE idCurso = ?', [id]),
  create: (data) => db.query(
    'INSERT INTO curso (nome, tipoCurso, cargaHorariaTotal, categoria, turno) VALUES (?,?,?,?,?)',
    [data.nome, data.tipoCurso, data.cargaHorariaTotal, data.categoria, data.turno]
  ),
  update: (id, data) => db.query(
    'UPDATE curso SET nome=?, tipoCurso=?, cargaHorariaTotal=?, categoria=?, turno=? WHERE idCurso=?',
    [data.nome, data.tipoCurso, data.cargaHorariaTotal, data.categoria, data.turno, id]
  ),
  delete: (id) =>
    db.query('DELETE FROM curso WHERE idCurso = ?', [id])
};

module.exports = Curso;