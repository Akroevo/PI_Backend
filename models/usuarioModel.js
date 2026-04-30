const db = require('../database/db');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const Usuario = {
  findAll: () => db.query('SELECT * FROM usuario'),

  findById: (id) =>
    db.query('SELECT * FROM usuario WHERE idusuario = ?', [id]),

  create: async (data) => {
    const senhaHash = await bcrypt.hash(data.senha, saltRounds);

    return db.query(
      'INSERT INTO usuario (login, senha, email, telefone, tipo_usuario) VALUES (?,?,?,?,?)',
      [data.login, senhaHash, data.email, data.telefone, data.tipo_usuario]
    );
  },

  update: (id, data) =>
    db.query(
      'UPDATE usuario SET login=?, email=?, telefone=?, tipo_usuario=? WHERE idusuario=?',
      [data.login, data.email, data.telefone, data.tipo_usuario, id]
    ),

  updateSenha: async (id, senha) => {
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    return db.query(
      'UPDATE usuario SET senha=? WHERE idusuario=?',
      [senhaHash, id]
    );
  },

  delete: (id) =>
    db.query('DELETE FROM usuario WHERE idusuario = ?', [id]),

  verificarSenha: async (senhaDigitada, senhaHash) => {
    return await bcrypt.compare(senhaDigitada, senhaHash);
  }
};

module.exports = Usuario;