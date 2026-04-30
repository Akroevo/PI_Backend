const SuperAdmin = require('../models/superadminModel');

exports.getAll = async (req, res) => {
  const [rows] = await SuperAdmin.findAll();
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [rows] = await SuperAdmin.findById(req.params.id);
  if (!rows.length) return res.status(404).json({ message: 'Não encontrado' });
  res.json(rows[0]);
};

exports.getByUsuario = async (req, res) => {
  const [rows] = await SuperAdmin.findByUsuario(req.params.idUsuario);
  if (!rows.length) return res.status(404).json({ message: 'Não encontrado' });
  res.json(rows[0]);
};

exports.create = async (req, res) => {
  const [result] = await SuperAdmin.create(req.body);
  res.status(201).json({ id: result.insertId });
};

exports.update = async (req, res) => {
  await SuperAdmin.update(req.params.id, req.body);
  res.json({ message: 'Atualizado' });
};

exports.remove = async (req, res) => {
  await SuperAdmin.delete(req.params.id);
  res.json({ message: 'Removido' });
};