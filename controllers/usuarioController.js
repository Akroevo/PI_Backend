const Usuario = require('../models/usuarioModel');
const { error: logError } = require('../middlewares/logger');

const erroInterno = (res, err) => {
  logError('Erro usuarioController: ' + err.message);
  res.status(500).json({ message: 'Erro interno', error: err.message });
};

exports.getAll = async (req, res) => {
  try {
    const [rows] = await Usuario.findAll();
    res.json(rows);
  } catch (err) { erroInterno(res, err); }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await Usuario.findById(req.params.id);
    if (!rows.length) return res.status(404).json({ message: 'Usuário não encontrado.' });
    res.json(rows[0]);
  } catch (err) { erroInterno(res, err); }
};

exports.create = async (req, res) => {
  try {
    const [result] = await Usuario.create(req.body);
    res.status(201).json({ id: result.insertId });
  } catch (err) { erroInterno(res, err); }
};

exports.update = async (req, res) => {
  try {
    await Usuario.update(req.params.id, req.body);
    res.json({ message: 'Atualizado' });
  } catch (err) { erroInterno(res, err); }
};

exports.updateSenha = async (req, res) => {
  try {
    await Usuario.updateSenha(req.params.id, req.body.senha);
    res.json({ message: 'Senha atualizada' });
  } catch (err) { erroInterno(res, err); }
};

exports.remove = async (req, res) => {
  try {
    await Usuario.delete(req.params.id);
    res.json({ message: 'Removido' });
  } catch (err) { erroInterno(res, err); }
};