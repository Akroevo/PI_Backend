const db = require('../database/db');

const Regra = {
  findAll: () => db.query('SELECT * FROM regrasdocurso'),
  findById: (id) =>
    db.query('SELECT * FROM regrasdocurso WHERE idRegra = ?', [id]),
  findByCurso: (idCurso) =>
    db.query('SELECT * FROM regrasdocurso WHERE curso_idCurso = ?', [idCurso]),
  create: (data) => db.query(
    `INSERT INTO regrasdocurso
      (curso_idCurso, categoria, cargaHorariaMin,
       cargaHorariaMax, cargaHorariaPermitida, descricao)
     VALUES (?,?,?,?,?,?)`,
    [data.curso_idCurso, data.categoria, data.cargaHorariaMin,
     data.cargaHorariaMax, data.cargaHorariaPermitida, data.descricao]
  ),
  update: (id, data) => db.query(
    `UPDATE regrasdocurso
     SET categoria=?, cargaHorariaMin=?, cargaHorariaMax=?,
         cargaHorariaPermitida=?, descricao=?
     WHERE idRegra=?`,
    [data.categoria, data.cargaHorariaMin, data.cargaHorariaMax,
     data.cargaHorariaPermitida, data.descricao, id]
  ),
  delete: (id) =>
    db.query('DELETE FROM regrasdocurso WHERE idRegra = ?', [id])
};

module.exports = Regra;