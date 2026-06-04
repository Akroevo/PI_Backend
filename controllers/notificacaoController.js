const Notificacao = require('../models/notificacaoModel');

exports.getAll = async (req, res) => {
  const [rows] = await Notificacao.findAll();
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [rows] = await Notificacao.findById(req.params.id);
  
  if (!rows || !rows.length) {
    return res.status(404).json({ message: 'Notificação não encontrada.' });
  }
  
  res.json(rows[0]);
};

exports.getBySubmissao = async (req, res) => {
  if (!req.params.idSubmissao) {
    return res.status(400).json({ message: 'O ID da submissão é obrigatório.' });
  }

  const [rows] = await Notificacao.findBySubmissao(req.params.idSubmissao);
  res.json(rows);
};

exports.getByDestinatario = async (req, res) => {
  if (!req.params.email) {
    return res.status(400).json({ message: 'O e-mail do destinatário é obrigatório.' });
  }

  const [rows] = await Notificacao.findByDestinatario(req.params.email);
  res.json(rows);
};

exports.create = async (req, res) => {
  if (!req.body.titulo || !req.body.mensagem || !req.body.destinatario) {
    return res.status(400).json({ message: 'Campos obrigatórios ausentes.' });
  }

  const [result] = await Notificacao.create(req.body);
  res.status(201).json({ id: result.insertId });
};

exports.remove = async (req, res) => {
  const [rows] = await Notificacao.findById(req.params.id);
  if (!rows || !rows.length) {
    return res.status(404).json({ message: 'Notificação não encontrada para remoção.' });
  }

  await Notificacao.delete(req.params.id);
  res.json({ message: 'Removido com sucesso' });
};
