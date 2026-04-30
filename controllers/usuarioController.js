const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcrypt');

exports.getAll = async (req, res) => {
  const [rows] = await Usuario.findAll();
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [rows] = await Usuario.findById(req.params.id);
  if (!rows.length) return res.status(404).json({ message: 'Não encontrado' });
  res.json(rows[0]);
};

exports.create = async (req, res) => {
  try {
    const [result] = await Usuario.create(req.body);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
};

exports.update = async (req, res) => {
  await Usuario.update(req.params.id, req.body);
  res.json({ message: 'Atualizado' });
};

exports.updateSenha = async (req, res) => {
  await Usuario.updateSenha(req.params.id, req.body.senha);
  res.json({ message: 'Senha atualizada' });
};

exports.remove = async (req, res) => {
  await Usuario.delete(req.params.id);
  res.json({ message: 'Removido' });
};