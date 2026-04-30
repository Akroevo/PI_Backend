const Coordenador = require('../models/coordenadorModel');

exports.getAll = async (req, res) => {
  const [rows] = await Coordenador.findAll();
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [rows] = await Coordenador.findById(req.params.id);
  if (!rows.length) return res.status(404).json({ message: 'Não encontrado' });
  res.json(rows[0]);
};

exports.create = async (req, res) => {
  const [result] = await Coordenador.create(req.body);
  res.status(201).json({ id: result.insertId });
};

exports.update = async (req, res) => {
  await Coordenador.update(req.params.id, req.body);
  res.json({ message: 'Atualizado' });
};

exports.remove = async (req, res) => {
  await Coordenador.delete(req.params.id);
  res.json({ message: 'Removido' });
};

exports.getCursos = async (req, res) => {
  const [rows] = await Coordenador.getCursos(req.params.id);
  res.json(rows);
};

exports.addCurso = async (req, res) => {
  await Coordenador.addCurso(req.params.id, req.body.idCurso);
  res.status(201).json({ message: 'Curso associado' });
};

exports.removeCurso = async (req, res) => {
  await Coordenador.removeCurso(req.params.id, req.params.idCurso);
  res.json({ message: 'Curso desassociado' });
};