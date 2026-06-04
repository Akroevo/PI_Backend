const Atividade = require('../models/atividadeModel');

exports.getAll = async (req, res) => {
  const [rows] = await Atividade.findAll();
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [rows] = await Atividade.findById(req.params.id);
  if (!rows.length) return res.status(404).json({ message: 'Não encontrado' });
  res.json(rows[0]);
};

exports.getByAluno = async (req, res) => {
  const [rows] = await Atividade.findByAluno(req.params.matricula);
  res.json(rows);
};

exports.create = async (req, res) => {
  const [result] = await Atividade.create(req.body);
  res.status(201).json({ id: result.insertId });
};

exports.update = async (req, res) => {
  await Atividade.update(req.params.id, req.body);
  res.json({ message: 'Atualizado' });
};

exports.remove = async (req, res) => {
  await Atividade.delete(req.params.id);
  res.json({ message: 'Removido' });
};