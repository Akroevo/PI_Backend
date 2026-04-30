const db = require('../database/db');

const Submissao = {
  findAll: () => db.query('SELECT * FROM submissao'),
  findById: (id) =>
    db.query('SELECT * FROM submissao WHERE idSubmissao = ?', [id]),
  findByCoordenador: (idCoordenador) =>
    db.query(
      'SELECT * FROM submissao WHERE coordenador_idCoordenador = ?',
      [idCoordenador]
    ),
  findByAtividade: (idAtividade) =>
    db.query('SELECT * FROM submissao WHERE atividade_idAtividade = ?', [
      idAtividade
    ]),
  create: (data) =>
    db.query(
      `INSERT INTO submissao (atividade_idAtividade, coordenador_idCoordenador, dataEnvio, status, observacao)
       VALUES (?,?,?,?,?)`,
      [
        data.atividade_idAtividade,
        data.coordenador_idCoordenador,
        data.dataEnvio || null,
        data.status || 'pendente',
        data.observacao || null
      ]
    ),
  updateStatus: (id, status, observacao) =>
    db.query(
      'UPDATE submissao SET status=?, observacao=? WHERE idSubmissao=?',
      [status, observacao ?? null, id]
    ),
  delete: (id) =>
    db.query('DELETE FROM submissao WHERE idSubmissao = ?', [id])
};

module.exports = Submissao;
