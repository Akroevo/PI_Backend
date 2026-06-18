const db = require('../database/db');

const Coordenador = {
  findAll: async () => {
    const [coordenadores] = await db.query('SELECT * FROM coordenador');
    for (const coord of coordenadores) {
      const [cursos] = await db.query(
        `SELECT c.* FROM curso c
          JOIN coordenador_curso cc ON c.idCurso = cc.curso_idCurso
          WHERE cc.coordenador_idCoordenador = ?`, [coord.idCoordenador]
      );
      coord.cursos = cursos;
    }
    return [coordenadores];
  },

  findById: (id) =>
    db.query('SELECT * FROM coordenador WHERE idCoordenador = ?', [id]),


 
  create: (data, conn = db) => conn.query(
    'INSERT INTO coordenador (nome, usuario_idusuario, telefone, email) VALUES (?,?,?,?)',
    [data.nome, data.usuario_idusuario, data.telefone, data.email]
  ),

  update: (id, data, conn = db) => conn.query(
    'UPDATE coordenador SET nome=?, telefone=?, email=? WHERE idCoordenador=?',
    [data.nome, data.telefone, data.email, id]
  ),

  delete: (id) =>
    db.query('DELETE FROM coordenador WHERE idCoordenador = ?', [id]),

  getCursos: (id) => db.query(
    `SELECT c.* FROM curso c
      JOIN coordenador_curso cc ON c.idCurso = cc.curso_idCurso
      WHERE cc.coordenador_idCoordenador = ?`, [id]
  ),

  addCurso: (id, idCurso, conn = db) => conn.query(
    'INSERT INTO coordenador_curso VALUES (?,?)', [id, idCurso]
  ),

  removeCurso: (id, idCurso) => db.query(
    'DELETE FROM coordenador_curso WHERE coordenador_idCoordenador=? AND curso_idCurso=?',
    [id, idCurso]
  ),

  removeTodosCursos: (id, conn = db) =>
    conn.query('DELETE FROM coordenador_curso WHERE coordenador_idCoordenador = ?', [id])
};

module.exports = Coordenador;
