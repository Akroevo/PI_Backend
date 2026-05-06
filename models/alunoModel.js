const db = require('../database/db');

function gerarMatricula() {
  const numeros = Math.floor(Math.random() * 9000000000) + 1000000000;
  return String(numeros);
}


const Aluno = {
  findAll: () => db.query('SELECT * FROM aluno'),
  findById: (mat) =>
    db.query('SELECT * FROM aluno WHERE matricula = ?', [mat]),
  create: async (data) => {
    let matricula;
    let existe = true;

    while (existe) {
      matricula = gerarMatricula();
      const [rows] = await db.query('SELECT matricula FROM aluno WHERE matricula = ?', [matricula]);
      existe = rows.length > 0;
    }

    return db.query(
      'INSERT INTO aluno (matricula, nome, dataEntrada, cargaHorariaAcumulada, usuario_idusuario) VALUES (?,?,?,?,?)',
      [matricula, data.nome, data.dataEntrada, data.cargaHorariaAcumulada || 0, data.usuario_idusuario]
    );
  },
  update: (mat, data) => db.query(
    'UPDATE aluno SET nome=?, cargaHorariaAcumulada=? WHERE matricula=?',
    [data.nome, data.cargaHorariaAcumulada, mat]
  ),
  delete: (mat) =>
    db.query('DELETE FROM aluno WHERE matricula = ?', [mat]),
  getCursos: (mat) => db.query(
    `SELECT c.* FROM curso c
      JOIN aluno_curso ac ON c.idCurso = ac.curso_idCurso
      WHERE ac.aluno_matricula = ?`, [mat]
  ),
  addCurso: (mat, idCurso) => db.query(
    'INSERT INTO aluno_curso (aluno_matricula, curso_idCurso) VALUES (?,?)',
    [mat, idCurso]
  ),
  removeCurso: (mat, idCurso) => db.query(
    'DELETE FROM aluno_curso WHERE aluno_matricula=? AND curso_idCurso=?',
    [mat, idCurso]
  )
};

module.exports = Aluno;