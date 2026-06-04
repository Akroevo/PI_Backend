const Certificado = require('../models/certificadoModel');

exports.getAll = async (req, res) => {
  const [rows] = await Certificado.findAll();
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [rows] = await Certificado.findById(req.params.id);
  if (!rows.length) return res.status(404).json({ message: 'Não encontrado' });
  res.json(rows[0]);
};

exports.getBySubmissao = async (req, res) => {
  const [rows] = await Certificado.findBySubmissao(req.params.idSubmissao);
  res.json(rows[0] || null);
};

exports.create = async (req, res) => {
  const [result] = await Certificado.create(req.body);
  res.status(201).json({ id: result.insertId });
};

exports.update = async (req, res) => {
  await Certificado.update(req.params.id, req.body);
  res.json({ message: 'Atualizado' });
};

exports.remove = async (req, res) => {
  await Certificado.delete(req.params.id);
  res.json({ message: 'Removido' });
};