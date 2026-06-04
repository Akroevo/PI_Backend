const Notificacao = require('../models/notificacaoModel');

exports.getAll = async (req, res) => {
  const [rows] = await Notificacao.findAll();
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [rows] = await Notificacao.findById(req.params.id);
  if (!rows.length) return res.status(404).json({ message: 'Não encontrado' });
  res.json(rows[0]);
};

exports.getBySubmissao = async (req, res) => {
  const [rows] = await Notificacao.findBySubmissao(req.params.idSubmissao);
  res.json(rows);
};

exports.getByDestinatario = async (req, res) => {
  const [rows] = await Notificacao.findByDestinatario(req.params.email);
  res.json(rows);
};

exports.create = async (req, res) => {
  const [result] = await Notificacao.create(req.body);
  res.status(201).json({ id: result.insertId });
};

exports.remove = async (req, res) => {
  await Notificacao.delete(req.params.id);
  res.json({ message: 'Removido' });
};