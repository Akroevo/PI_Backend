const db = require('../database/db');

const Certificado = {
  findAll: () => db.query('SELECT * FROM certificado'),
  findById: (id) =>
    db.query('SELECT * FROM certificado WHERE idCertificado = ?', [id]),
  findBySubmissao: (idS) =>
    db.query('SELECT * FROM certificado WHERE submissao_idSubmissao = ?', [idS]),
  create: (data) => db.query(
    'INSERT INTO certificado (submissao_idSubmissao, nomeArquivo, caminhoArquivo, textoOCR) VALUES (?,?,?,?)',
    [data.submissao_idSubmissao, data.nomeArquivo, data.caminhoArquivo, data.textoOCR || null]
  ),
  update: (id, data) => db.query(
    'UPDATE certificado SET nomeArquivo=?, caminhoArquivo=?, textoOCR=? WHERE idCertificado=?',
    [data.nomeArquivo, data.caminhoArquivo, data.textoOCR, id]
  ),
  delete: (id) =>
    db.query('DELETE FROM certificado WHERE idCertificado = ?', [id])
};

module.exports = Certificado;