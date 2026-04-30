const Submissao = require('../models/submissaoModel');

exports.getAll = async (req, res) => {
  const [rows] = await Submissao.findAll();
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [rows] = await Submissao.findById(req.params.id);
  if (!rows.length) return res.status(404).json({ message: 'Não encontrado' });
  res.json(rows[0]);
};

exports.getByCoordenador = async (req, res) => {
  const [rows] = await Submissao.findByCoordenador(req.params.idCoordenador);
  res.json(rows);
};

exports.getByAtividade = async (req, res) => {
  const [rows] = await Submissao.findByAtividade(req.params.idAtividade);
  res.json(rows);
};

exports.create = async (req, res) => {
  const [result] = await Submissao.create(req.body);
  res.status(201).json({ id: result.insertId });
};

exports.updateStatus = async (req, res) => {
  const { status, observacao } = req.body;
  await Submissao.updateStatus(req.params.id, status, observacao);
  res.json({ message: 'Status atualizado' });
};

exports.remove = async (req, res) => {
  await Submissao.delete(req.params.id);
  res.json({ message: 'Removido' });
};