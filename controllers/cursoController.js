const Curso = require('../models/cursoModel');

exports.getAll = async (req, res) => {
  const [rows] = await Curso.findAll();
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [rows] = await Curso.findById(req.params.id);
  if (!rows.length) return res.status(404).json({ message: 'Não encontrado' });
  res.json(rows[0]);
};

exports.create = async (req, res) => {
  const [result] = await Curso.create(req.body);
  res.status(201).json({ id: result.insertId });
};

exports.update = async (req, res) => {
  await Curso.update(req.params.id, req.body);
  res.json({ message: 'Atualizado' });
};

exports.remove = async (req, res) => {
  await Curso.delete(req.params.id);
  res.json({ message: 'Removido' });
};