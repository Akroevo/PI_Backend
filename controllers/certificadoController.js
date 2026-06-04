const Certificado = require('../models/certificadoModel');

const erroInterno = (res, err) => {
  console.error('Erro certificadoController:', err.message);
  res.status(500).json({ message: 'Erro interno', error: err.message });
};

exports.getAll = async (req, res) => {
  try {
    const [rows] = await Certificado.findAll();
    res.json(rows);
  } catch (err) { erroInterno(res, err); }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await Certificado.findById(req.params.id);
    if (!rows.length) return res.status(404).json({ message: 'Certificado não encontrado.' });
    res.json(rows[0]);
  } catch (err) { erroInterno(res, err); }
};

exports.getBySubmissao = async (req, res) => {
  try {
    const [rows] = await Certificado.findBySubmissao(req.params.idSubmissao);
    if (!rows.length) return res.status(404).json({ message: 'Nenhum certificado para esta submissão.' });
    res.json(rows[0]);
  } catch (err) { erroInterno(res, err); }
};

exports.getByAluno = async (req, res) => {
  try {
    const [rows] = await Certificado.findByAluno(req.params.idAluno);
    if (!rows.length) return res.status(404).json({ message: 'Nenhum certificado encontrado para este aluno.' });
    res.json(rows);
  } catch (err) { erroInterno(res, err); }
};

exports.create = async (req, res) => {
  try {
    const [result] = await Certificado.create(req.body);
    res.status(201).json({ id: result.insertId });
  } catch (err) { erroInterno(res, err); }
};

exports.update = async (req, res) => {
  try {
    await Certificado.update(req.params.id, req.body);
    res.json({ message: 'Atualizado' });
  } catch (err) { erroInterno(res, err); }
};

exports.remove = async (req, res) => {
  try {
    await Certificado.delete(req.params.id);
    res.json({ message: 'Removido' });
  } catch (err) { erroInterno(res, err); }
};