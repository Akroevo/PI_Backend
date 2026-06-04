const Regra = require('../models/regraModel');

exports.getAll = async (req, res) => {
  const [rows] = await Regra.findAll();
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [rows] = await Regra.findById(req.params.id);
  
  if (!rows || !rows.length) {
    return res.status(404).json({ message: 'Regra não encontrada.' });
  }
  
  res.json(rows);
};

exports.getByCurso = async (req, res) => {
  if (!req.params.idCurso) {
    return res.status(400).json({ message: 'O ID do curso é obrigatório.' });
  }

  const [rows] = await Regra.findByCurso(req.params.idCurso);
  res.json(rows);
};

exports.create = async (req, res) => {
  if (!req.body.nome || !req.body.descricao) { 
    return res.status(400).json({ message: 'Campos obrigatórios ausentes.' });
  }

  const [result] = await Regra.create(req.body);
  res.status(201).json({ id: result.insertId });
};

exports.update = async (req, res) => {
  const [rows] = await Regra.findById(req.params.id);
  if (!rows || !rows.length) {
    return res.status(404).json({ message: 'Regra não encontrada para atualização.' });
  }

  await Regra.update(req.params.id, req.body);
  res.json({ message: 'Atualizado com sucesso' });
};

exports.remove = async (req, res) => {
  const [rows] = await Regra.findById(req.params.id);
  if (!rows || !rows.length) {
    return res.status(404).json({ message: 'Regra não encontrada para remoção.' });
  }

  await Regra.delete(req.params.id);
  res.json({ message: 'Removido com sucesso' });
};
