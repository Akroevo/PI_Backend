const Atividade = require('../models/atividadeModel');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await Atividade.findAll();
    res.json(rows);
  } catch (err) {
    console.error('Erro getAll atividade:', err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await Atividade.findById(req.params.id);
    if (!rows.length) return res.status(404).json({ message: 'Não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Erro getById atividade:', err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.getByAluno = async (req, res) => {
  try {
    const [rows] = await Atividade.findByAluno(req.params.matricula);
    res.json(rows);
  } catch (err) {
    console.error('Erro getByAluno atividade:', err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const [result] = await Atividade.create(req.body);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('Erro create atividade:', err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    await Atividade.update(req.params.id, req.body);
    res.json({ message: 'Atualizado' });
  } catch (err) {
    console.error('Erro update atividade:', err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Atividade.delete(req.params.id);
    res.json({ message: 'Removido' });
  } catch (err) {
    console.error('Erro remove atividade:', err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};