const db = require('../database/db');

const Atividade = {
  findAll: () => db.query('SELECT * FROM atividadecomplementar'),
  findById: (id) =>
    db.query('SELECT * FROM atividadecomplementar WHERE idAtividade = ?', [id]),
  findByAluno: (mat) =>
    db.query('SELECT * FROM atividadecomplementar WHERE aluno_matricula = ?', [mat]),
  create: (data) => db.query(
    `INSERT INTO atividadecomplementar
      (codigo, titulo, descricao, cargaHorariaSolicitada,
       aluno_matricula, regra_idRegra)
     VALUES (?,?,?,?,?,?)`,
    [data.codigo, data.titulo, data.descricao,
     data.cargaHorariaSolicitada, data.aluno_matricula, data.regra_idRegra]
  ),
  update: (id, data) => db.query(
    `UPDATE atividadecomplementar
     SET codigo=?, titulo=?, descricao=?,
         cargaHorariaSolicitada=?, regra_idRegra=?
     WHERE idAtividade=?`,
    [data.codigo, data.titulo, data.descricao,
     data.cargaHorariaSolicitada, data.regra_idRegra, id]
  ),
  delete: (id) =>
    db.query('DELETE FROM atividadecomplementar WHERE idAtividade = ?', [id])
};

module.exports = Atividade;