const Regra = require('../models/regraModel');

exports.getAll = async (req, res) => {
  const [rows] = await Regra.findAll();
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [rows] = await Regra.findById(req.params.id);
  if (!rows.length) return res.status(404).json({ message: 'Não encontrado' });
  res.json(rows[0]);
};

exports.getByCurso = async (req, res) => {
  const [rows] = await Regra.findByCurso(req.params.idCurso);
  res.json(rows);
};

exports.create = async (req, res) => {
  const [result] = await Regra.create(req.body);
  res.status(201).json({ id: result.insertId });
};

exports.update = async (req, res) => {
  await Regra.update(req.params.id, req.body);
  res.json({ message: 'Atualizado' });
};

exports.remove = async (req, res) => {
  await Regra.delete(req.params.id);
  res.json({ message: 'Removido' });
};