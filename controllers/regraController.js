const Regra = require('../models/regraModel');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await Regra.findAll();
    res.json(rows);
  } catch (err) {
    console.error('Erro getAll regra:', err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await Regra.findById(req.params.id);
    if (!rows || !rows.length) {
      return res.status(404).json({ message: 'Regra não encontrada.' });
    }
    res.json(rows);
  } catch (err) {
    console.error('Erro getById regra:', err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.getByCurso = async (req, res) => {
  try {
    if (!req.params.idCurso) {
      return res.status(400).json({ message: 'O ID do curso é obrigatório.' });
    }
    const [rows] = await Regra.findByCurso(req.params.idCurso);
    res.json(rows);
  } catch (err) {
    console.error('Erro getByCurso regra:', err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    if (!req.body.nome || !req.body.descricao) {
      return res.status(400).json({ message: 'Campos obrigatórios ausentes.' });
    }
    const [result] = await Regra.create(req.body);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('Erro create regra:', err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [rows] = await Regra.findById(req.params.id);
    if (!rows || !rows.length) {
      return res.status(404).json({ message: 'Regra não encontrada para atualização.' });
    }
    await Regra.update(req.params.id, req.body);
    res.json({ message: 'Atualizado com sucesso' });
  } catch (err) {
    console.error('Erro update regra:', err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const [rows] = await Regra.findById(req.params.id);
    if (!rows || !rows.length) {
      return res.status(404).json({ message: 'Regra não encontrada para remoção.' });
    }
    await Regra.delete(req.params.id);
    res.json({ message: 'Removido com sucesso' });
  } catch (err) {
    console.error('Erro remove regra:', err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};