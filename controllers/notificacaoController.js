const Notificacao = require('../models/notificacaoModel');
const AppError = require('../utils/AppError');
const errorCatalog = require('../utils/errorCatalog');

exports.getAll = async (req, res) => {
  const [rows] = await Notificacao.findAll();
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [rows] = await Notificacao.findById(req.params.id);
  
  if (!rows || !rows.length) {
    throw new AppError('Notificação não encontrada.', 404, 'ERR_NOTIFICACAO_NOT_FOUND');
  }
  
  res.json(rows[0]);
};

exports.getBySubmissao = async (req, res) => {
  if (!req.params.idSubmissao) {
    throw new AppError('O ID da submissão é obrigatório.', 400, 'ERR_INVALID_INPUT');
  }

  const [rows] = await Notificacao.findBySubmissao(req.params.idSubmissao);
  res.json(rows);
};

exports.getByDestinatario = async (req, res) => {
  if (!req.params.email) {
    throw new AppError('O e-mail do destinatário é obrigatório.', 400, 'ERR_INVALID_INPUT');
  }

  const [rows] = await Notificacao.findByDestinatario(req.params.email);
  res.json(rows);
};

exports.create = async (req, res) => {
  if (!req.body.titulo || !req.body.mensagem || !req.body.destinatario) {
    throw new AppError('Campos obrigatórios ausentes.', 400, 'ERR_VALIDATION_FAILED');
  }

  const [result] = await Notificacao.create(req.body);
  res.status(201).json({ id: result.insertId });
};

exports.remove = async (req, res) => {
  const [rows] = await Notificacao.findById(req.params.id);
  if (!rows || !rows.length) {
    throw new AppError('Notificação não encontrada para remoção.', 404, 'ERR_NOTIFICACAO_NOT_FOUND');
  }

  await Notificacao.delete(req.params.id);
  res.json({ message: 'Removido com sucesso' });
};
