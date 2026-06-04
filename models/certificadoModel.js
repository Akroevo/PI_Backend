const db = require('../database/db');

const Certificado = {
  findAll: () => db.query('SELECT * FROM certificado'),

  findById: (id) =>
    db.query('SELECT * FROM certificado WHERE idCertificado = ?', [id]),

  findBySubmissao: (idSubmissao) =>
    db.query('SELECT * FROM certificado WHERE submissao_idSubmissao = ?', [idSubmissao]),

  findByAluno: (idAluno) =>
    db.query(
      `SELECT c.*
       FROM certificado c
       JOIN submissao s         ON s.idSubmissao       = c.submissao_idSubmissao
       JOIN atividadecomplementar a ON a.idAtividade   = s.atividade_idAtividade
       JOIN aluno al            ON al.matricula        = a.aluno_matricula
       WHERE al.matricula = ?`,
      [idAluno]
    ),

  create: (data) =>
    db.query(
      'INSERT INTO certificado (submissao_idSubmissao, nomeArquivo, caminhoArquivo, textoOCR) VALUES (?,?,?,?)',
      [data.submissao_idSubmissao, data.nomeArquivo, data.caminhoArquivo, data.textoOCR || null]
    ),

  update: (id, data) =>
    db.query(
      'UPDATE certificado SET nomeArquivo=?, caminhoArquivo=?, textoOCR=? WHERE idCertificado=?',
      [data.nomeArquivo, data.caminhoArquivo, data.textoOCR, id]
    ),

  delete: (id) =>
    db.query('DELETE FROM certificado WHERE idCertificado = ?', [id]),
};

module.exports = Certificado;