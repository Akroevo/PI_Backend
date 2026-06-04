const Aluno = require('../models/alunoModel');
const db = require('../database/db');

exports.getAll = async (req, res) => {
  const [rows] = await Aluno.findAll();
  const alunos = await Promise.all(rows.map(async (aluno) => {
    const [cursos] = await Aluno.getCursos(aluno.matricula);
    return { ...aluno, cursos };
  }));
  res.json(alunos);
};

exports.getById = async (req, res) => {
  const [rows] = await Aluno.findById(req.params.matricula);
  if (!rows.length) return res.status(404).json({ message: 'Não encontrado' });
  const [cursos] = await Aluno.getCursos(req.params.matricula);
  res.json({ ...rows[0], cursos });
};

exports.create = async (req, res) => {
  await Aluno.create(req.body);
  res.status(201).json({ message: 'Aluno criado com sucesso' });
};

exports.update = async (req, res) => {
  await Aluno.update(req.params.matricula, req.body);

  if (req.body.email) {
    const [rows] = await Aluno.findById(req.params.matricula);
    if (rows.length && rows[0].usuario_idusuario) {
      await db.query('UPDATE usuario SET email=? WHERE idusuario=?', [req.body.email, rows[0].usuario_idusuario]);
    }
  }

  if (req.body.cursos !== undefined) {
    await Aluno.removeTodosCursos(req.params.matricula);
    for (const idCurso of req.body.cursos) {
      await Aluno.addCurso(req.params.matricula, idCurso);
    }
  }

  res.json({ message: 'Atualizado' });
};

exports.remove = async (req, res) => {
  await Aluno.delete(req.params.matricula);
  res.json({ message: 'Removido' });
};

exports.getCursos = async (req, res) => {
  const [rows] = await Aluno.getCursos(req.params.matricula);
  res.json(rows);
};

exports.addCurso = async (req, res) => {
  await Aluno.addCurso(req.params.matricula, req.body.idCurso);
  res.status(201).json({ message: 'Matriculado no curso' });
};

exports.removeCurso = async (req, res) => {
  await Aluno.removeCurso(req.params.matricula, req.params.idCurso);
  res.json({ message: 'Desmatriculado do curso' });
};