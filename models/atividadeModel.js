const db = require('../database/db');
const Atividade = {
  findAll: () => db.query('SELECT * FROM atividadecomplementar'),
  findById: (id) =>
    db.query('SELECT * FROM atividadecomplementar WHERE idAtividade = ?', [id]),
  findByAluno: (mat) =>
    db.query(
      `SELECT a.*, s.idSubmissao, s.status AS statusSubmissao, s.observacao,
              s.urlCertificado, s.dataEnvio, s.cargaHorariaAprovada
       FROM atividadecomplementar a
       LEFT JOIN submissao s ON s.atividade_idAtividade = a.idAtividade
       WHERE a.aluno_matricula = ?`,
      [mat]
    ),
  findByCoordenador: (idCoordenador) =>
    db.query(
      `SELECT DISTINCT a.* FROM atividadecomplementar a
       JOIN aluno al ON al.matricula = a.aluno_matricula
       JOIN aluno_curso ac ON ac.aluno_matricula = al.matricula
       JOIN coordenador_curso cc ON cc.curso_idCurso = ac.curso_idCurso
       WHERE cc.coordenador_idCoordenador = ?`,
      [idCoordenador]
    ),
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
    db.query('DELETE FROM atividadecomplementar WHERE idAtividade = ?', [id]),
  avaliar: (id, data) => db.query(
    `UPDATE atividadecomplementar
     SET status=?, cargaHorariaAprovada=?, observacao=?, coordenador_idCoordenador=?
     WHERE idAtividade=?`,
    [data.status, data.cargaHorariaAprovada, data.observacao, data.coordenador_idCoordenador, id]
  )
};
module.exports = Atividade;
