const Curso = require('../models/cursoModel');
const AppError = require('../utils/AppError');
const errorCatalog = require('../utils/errorCatalog');

const tiposValidos = ['EAD', 'Presencial', 'Hibrido'];
const turnosValidos = ['Manha', 'Tarde', 'Noite'];

exports.getAll = async (req, res) => {
  const [rows] = await Curso.findAll();
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [rows] = await Curso.findById(req.params.id);
  
  if (!rows || !rows.length) {
    throw new AppError('Curso não encontrado.', 404, 'ERR_CURSO_NOT_FOUND');
  }
  
  res.json(rows);
};

exports.create = async (req, res) => {
  const { nome, tipoCurso, turno } = req.body;

  if (!nome || !tipoCurso || !turno) {
    throw new AppError('Campos obrigatórios ausentes.', 400, 'ERR_VALIDATION_FAILED');
  }

  if (!tiposValidos.includes(tipoCurso)) {
    throw new AppError(`tipoCurso inválido. Use: ${tiposValidos.join(', ')}`, 400, 'ERR_INVALID_COURSE_TYPE');
  }

  if (!turnosValidos.includes(turno)) {
    throw new AppError(`turno inválido. Use: ${turnosValidos.join(', ')}`, 400, 'ERR_INVALID_COURSE_SHIFT');
  }

  const [result] = await Curso.create(req.body);
  res.status(201).json({ id: result.insertId });
};

exports.update = async (req, res) => {
  const { tipoCurso, turno } = req.body;

  const [rows] = await Curso.findById(req.params.id);
  if (!rows || !rows.length) {
    throw new AppError('Curso não encontrado para atualização.', 404, 'ERR_CURSO_NOT_FOUND');
  }

  if (tipoCurso && !tiposValidos.includes(tipoCurso)) {
    throw new AppError(`tipoCurso inválido. Use: ${tiposValidos.join(', ')}`, 400, 'ERR_INVALID_COURSE_TYPE');
  }

  if (turno && !turnosValidos.includes(turno)) {
    throw new AppError(`turno inválido. Use: ${turnosValidos.join(', ')}`, 400, 'ERR_INVALID_COURSE_SHIFT');
  }

  await Curso.update(req.params.id, req.body);
  res.json({ message: 'Atualizado com sucesso' });
};

exports.remove = async (req, res) => {
  const [rows] = await Curso.findById(req.params.id);
  if (!rows || !rows.length) {
    throw new AppError('Curso não encontrado para remoção.', 404, 'ERR_CURSO_NOT_FOUND');
  }

  await Curso.delete(req.params.id);
  res.json({ message: 'Removido com sucesso' });
};
