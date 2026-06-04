const Curso = require('../models/cursoModel');

const tiposValidos = ['EAD', 'Presencial', 'Hibrido'];
const turnosValidos = ['Manha', 'Tarde', 'Noite'];

exports.getAll = async (req, res) => {
  const [rows] = await Curso.findAll();
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [rows] = await Curso.findById(req.params.id);
  
  if (!rows || !rows.length) {
    return res.status(404).json({ message: 'Curso não encontrado.' });
  }
  
  res.json(rows);
};

exports.create = async (req, res) => {
  const { nome, tipoCurso, turno } = req.body;

  if (!nome || !tipoCurso || !turno) {
    return res.status(400).json({ message: 'Campos obrigatórios ausentes.' });
  }

  if (!tiposValidos.includes(tipoCurso)) {
    return res.status(400).json({ message: `tipoCurso inválido. Use: ${tiposValidos.join(', ')}` });
  }

  if (!turnosValidos.includes(turno)) {
    return res.status(400).json({ message: `turno inválido. Use: ${turnosValidos.join(', ')}` });
  }

  const [result] = await Curso.create(req.body);
  res.status(201).json({ id: result.insertId });
};

exports.update = async (req, res) => {
  const { tipoCurso, turno } = req.body;

  const [rows] = await Curso.findById(req.params.id);
  if (!rows || !rows.length) {
    return res.status(404).json({ message: 'Curso não encontrado para atualização.' });
  }

  if (tipoCurso && !tiposValidos.includes(tipoCurso)) {
    return res.status(400).json({ message: `tipoCurso inválido. Use: ${tiposValidos.join(', ')}` });
  }

  if (turno && !turnosValidos.includes(turno)) {
    return res.status(400).json({ message: `turno inválido. Use: ${turnosValidos.join(', ')}` });
  }

  await Curso.update(req.params.id, req.body);
  res.json({ message: 'Atualizado com sucesso' });
};

exports.remove = async (req, res) => {
  const [rows] = await Curso.findById(req.params.id);
  if (!rows || !rows.length) {
    return res.status(404).json({ message: 'Curso não encontrado para remoção.' });
  }

  await Curso.delete(req.params.id);
  res.json({ message: 'Removido com sucesso' });
};
