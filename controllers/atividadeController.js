const Atividade = require('../models/atividadeModel');
const { error: logError } = require('../middlewares/logger');

exports.getAll = async function (req, res) {
  try {
    const user = req.user;
    const atividades = await Atividade.find()
      .populate('alunoId');

    if (user.role === 'superadmin') {
      return res.json(atividades);
    }

    if (user.role === 'coordenador') {
      const filtradas = atividades.filter(a =>
        a.alunoId &&
        a.alunoId.coordenadorId == user.id
      );
      return res.json(filtradas);
    }
    return res.status(403).json({ message: 'Sem permissão' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await Atividade.findById(req.params.id);
    if (!rows.length) return res.status(404).json({ message: 'Não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    logError('Erro getById atividade: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.getByAluno = async (req, res) => {
  try {
    const [rows] = await Atividade.findByAluno(req.params.matricula);
    res.json(rows);
  } catch (err) {
    logError('Erro getByAluno atividade: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const [result] = await Atividade.create(req.body);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    logError('Erro create atividade: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    await Atividade.update(req.params.id, req.body);
    res.json({ message: 'Atualizado' });
  } catch (err) {
    logError('Erro update atividade: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Atividade.delete(req.params.id);
    res.json({ message: 'Removido' });
  } catch (err) {
    logError('Erro remove atividade: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};
