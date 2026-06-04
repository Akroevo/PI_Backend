const Regra = require('../models/regraModel');
const AppError = require('../utils/AppError');
const errorCatalog = require('../utils/errorCatalog');

exports.getAll = async (req, res) => {
  const [rows] = await Regra.findAll();
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [rows] = await Regra.findById(req.params.id);
  
  if (!rows || !rows.length) {
    throw new AppError('Regra não encontrada.', 404, 'ERR_REGRA_NOT_FOUND');
  }
  
  res.json(rows);
};

exports.getByCurso = async (req, res) => {
  if (!req.params.idCurso) {
    throw new AppError('O ID do curso é obrigatório.', 400, 'ERR_INVALID_INPUT');
  }

  const [rows] = await Regra.findByCurso(req.params.idCurso);
  res.json(rows);
};

exports.create = async (req, res) => {
  if (!req.body.nome || !req.body.descricao) { 
    throw new AppError('Campos obrigatórios ausentes.', 400, 'ERR_VALIDATION_FAILED');
  }

  const [result] = await Regra.create(req.body);
  res.status(201).json({ id: result.insertId });
};

exports.update = async (req, res) => {
  const [rows] = await Regra.findById(req.params.id);
  if (!rows || !rows.length) {
    throw new AppError('Regra não encontrada para atualização.', 404, 'ERR_REGRA_NOT_FOUND');
  }

  await Regra.update(req.params.id, req.body);
  res.json({ message: 'Atualizado com sucesso' });
};

exports.remove = async (req, res) => {
  const [rows] = await Regra.findById(req.params.id);
  if (!rows || !rows.length) {
    throw new AppError('Regra não encontrada para remoção.', 404, 'ERR_REGRA_NOT_FOUND');
  }

  await Regra.delete(req.params.id);
  res.json({ message: 'Removido com sucesso' });
};
