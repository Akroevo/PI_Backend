const SuperAdmin = require('../models/superAdminModel');

const erroInterno = (res, err) => {
  console.error('Erro superAdminController:', err.message);
  res.status(500).json({ message: 'Erro interno', error: err.message });
};

exports.getAll = async (req, res) => {
  try {
    const [rows] = await SuperAdmin.findAll();
    res.json(rows);
  } catch (err) { erroInterno(res, err); }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await SuperAdmin.findById(req.params.id);
    if (!rows.length) return res.status(404).json({ message: 'Não encontrado.' });
    res.json(rows[0]);
  } catch (err) { erroInterno(res, err); }
};

exports.getByUsuario = async (req, res) => {
  try {
    const [rows] = await SuperAdmin.findByUsuario(req.params.idUsuario);
    if (!rows.length) return res.status(404).json({ message: 'Não encontrado.' });
    res.json(rows[0]);
  } catch (err) { erroInterno(res, err); }
};

exports.create = async (req, res) => {
  try {
    const [result] = await SuperAdmin.create(req.body);
    res.status(201).json({ id: result.insertId });
  } catch (err) { erroInterno(res, err); }
};

exports.update = async (req, res) => {
  try {
    await SuperAdmin.update(req.params.id, req.body);
    res.json({ message: 'Atualizado' });
  } catch (err) { erroInterno(res, err); }
};

exports.remove = async (req, res) => {
  try {
    await SuperAdmin.delete(req.params.id);
    res.json({ message: 'Removido' });
  } catch (err) { erroInterno(res, err); }
};