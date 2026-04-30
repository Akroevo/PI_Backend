const Aluno = require('../models/alunoModel');

exports.getAll = async (req, res) => {
  const [rows] = await Aluno.findAll();
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [rows] = await Aluno.findById(req.params.matricula);
  if (!rows.length) return res.status(404).json({ message: 'Não encontrado' });
  res.json(rows[0]);
};

exports.create = async (req, res) => {
  const [result] = await Aluno.create(req.body);
  res.status(201).json({ matricula: result.insertId });
};

exports.update = async (req, res) => {
  await Aluno.update(req.params.matricula, req.body);
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