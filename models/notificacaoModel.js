const db = require('../database/db');

const Notificacao = {
  findAll: () => db.query('SELECT * FROM notificacao_email'),
  findById: (id) =>
    db.query('SELECT * FROM notificacao_email WHERE idNotificacao = ?', [id]),
  findBySubmissao: (idS) =>
    db.query('SELECT * FROM notificacao_email WHERE submissao_idSubmissao = ?', [idS]),
  findByDestinatario: (email) =>
    db.query('SELECT * FROM notificacao_email WHERE destinatario = ?', [email]),
  create: (data) => db.query(
    `INSERT INTO notificacao_email
      (submissao_idSubmissao, destinatario, assunto, corpo, dataEnvio)
     VALUES (?,?,?,?,NOW())`,
    [data.submissao_idSubmissao, data.destinatario, data.assunto, data.corpo]
  ),
  delete: (id) =>
    db.query('DELETE FROM notificacao_email WHERE idNotificacao = ?', [id])
};

module.exports = Notificacao;