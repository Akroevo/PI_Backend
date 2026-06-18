const Certificado = require('../models/certificadoModel');
const { error: logError } = require('../middlewares/logger');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await Certificado.findAll();
    res.json(rows);
  } catch (err) {
    logError('Erro getAll certificado: ' + err.message);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await Certificado.findById(req.params.id);
    if (!rows || !rows.length) {
      return res.status(404).json({ message: 'Certificado não encontrado.' });
    }
    res.json(rows);
  } catch (err) {
    logError('Erro getById certificado: ' + err.message);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

exports.getBySubmissao = async (req, res) => {
  try {
    const [rows] = await Certificado.findBySubmissao(req.params.idSubmissao);
    if (!rows || !rows.length) {
      return res.status(404).json({ message: 'Nenhum certificado encontrado para esta submissão.' });
    }
    res.json(rows);
  } catch (err) {
    logError('Erro getBySubmissao certificado: ' + err.message);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

exports.getByAluno = async (req, res) => {
  try {
    const [rows] = await Certificado.findByAluno(req.params.matricula);
    res.json(rows || []);
  } catch (err) {
    logError('Erro getByAluno certificado: ' + err.message);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

exports.create = async (req, res) => {
  try {
    if (!req.body.submissao_idSubmissao || !req.body.caminhoArquivo) {
      return res.status(400).json({ message: 'Campos obrigatórios ausentes.' });
    }

    const [result] = await Certificado.create(req.body);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    logError('Erro create certificado: ' + err.message);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

exports.update = async (req, res) => {
  try {
    const [rows] = await Certificado.findById(req.params.id);
    if (!rows || !rows.length) {
      return res.status(404).json({ message: 'Certificado não encontrado para atualização.' });
    }

    await Certificado.update(req.params.id, req.body);
    res.json({ message: 'Atualizado com sucesso' });
  } catch (err) {
    logError('Erro update certificado: ' + err.message);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

exports.remove = async (req, res) => {
  try {
    const [rows] = await Certificado.findById(req.params.id);
    if (!rows || !rows.length) {
      return res.status(404).json({ message: 'Certificado não encontrado para remoção.' });
    }

    await Certificado.delete(req.params.id);
    res.json({ message: 'Removido com sucesso' });
  } catch (err) {
    logError('Erro remove certificado: ' + err.message);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};