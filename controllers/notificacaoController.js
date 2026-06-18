const Notificacao = require('../models/notificacaoModel');
const { error: logError } = require('../middlewares/logger');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await Notificacao.findAll();
    res.json(rows);
  } catch (err) {
    logError('Erro getAll notificacao: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await Notificacao.findById(req.params.id);

    if (!rows || !rows.length) {
      return res.status(404).json({ message: 'Notificação não encontrada.' });
    }

    res.json(rows[0]);
  } catch (err) {
    logError('Erro getById notificacao: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.getBySubmissao = async (req, res) => {
  try {
    if (!req.params.idSubmissao) {
      return res.status(400).json({ message: 'O ID da submissão é obrigatório.' });
    }

    const [rows] = await Notificacao.findBySubmissao(req.params.idSubmissao);
    res.json(rows);
  } catch (err) {
    logError('Erro getBySubmissao notificacao: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.getByDestinatario = async (req, res) => {
  try {
    if (!req.params.email) {
      return res.status(400).json({ message: 'O e-mail do destinatário é obrigatório.' });
    }

    const [rows] = await Notificacao.findByDestinatario(req.params.email);
    res.json(rows);
  } catch (err) {
    logError('Erro getByDestinatario notificacao: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    if (!req.body.titulo || !req.body.mensagem || !req.body.destinatario) {
      return res.status(400).json({ message: 'Campos obrigatórios ausentes.' });
    }

    const [result] = await Notificacao.create(req.body);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    logError('Erro create notificacao: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const [rows] = await Notificacao.findById(req.params.id);
    if (!rows || !rows.length) {
      return res.status(404).json({ message: 'Notificação não encontrada para remoção.' });
    }

    await Notificacao.delete(req.params.id);
    res.json({ message: 'Removido com sucesso' });
  } catch (err) {
    logError('Erro remove notificacao: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};