const Coordenador = require('../models/coordenadorModel');
const { error: logError } = require('../middlewares/logger');
const Submissao = require('../models/submissaoModel');
const submissaoController = require('./submissaoController');
const db = require('../database/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await Coordenador.findAll();
    res.json(rows);
  } catch (err) {
    logError('Erro getAll coordenador: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await Coordenador.findById(req.params.id);
    if (!rows || !rows.length) return res.status(404).json({ message: 'Coordenador não encontrado.' });
    res.json(rows[0]);
  } catch (err) {
    logError('Erro getById coordenador: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    if (!req.body.nome || !req.body.usuario_idusuario) {
      return res.status(400).json({ message: 'Campos obrigatórios ausentes.' });
    }
    const [existing] = await db.query(
      'SELECT idCoordenador FROM coordenador WHERE usuario_idusuario = ?',
      [req.body.usuario_idusuario]
    );
    if (existing.length) {
      return res.status(409).json({ message: 'Já existe um coordenador para esse usuário.' });
    }
    await db.query(
      'UPDATE usuario SET tipo_usuario = ? WHERE idusuario = ?',
      ['coordenador', req.body.usuario_idusuario]
    );
    const [result] = await Coordenador.create(req.body);
    const idCoordenador = result.insertId;
    if (req.body.cursos?.length > 0) {
      for (const idCurso of req.body.cursos) {
        await Coordenador.addCurso(idCoordenador, idCurso);
      }
    }
    res.status(201).json({ id: idCoordenador });
  } catch (err) {
    logError('Erro create coordenador: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [rows] = await Coordenador.findById(req.params.id);
    if (!rows || !rows.length) return res.status(404).json({ message: 'Coordenador não encontrado para atualização.' });
    await Coordenador.update(req.params.id, req.body);
    if (req.body.cursos !== undefined) {
      await Coordenador.removeTodosCursos(req.params.id);
      for (const idCurso of req.body.cursos) {
        await Coordenador.addCurso(req.params.id, idCurso);
      }
    }
    res.json({ message: 'Atualizado com sucesso' });
  } catch (err) {
    logError('Erro update coordenador: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const [rows] = await Coordenador.findById(req.params.id);
    if (!rows || !rows.length) return res.status(404).json({ message: 'Coordenador não encontrado para remoção.' });
    await Coordenador.delete(req.params.id);
    res.json({ message: 'Removido com sucesso' });
  } catch (err) {
    logError('Erro remove coordenador: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.getCursos = async (req, res) => {
  try {
    const [rows] = await Coordenador.findById(req.params.id);
    if (!rows || !rows.length) return res.status(404).json({ message: 'Coordenador não encontrado.' });
    const [cursos] = await Coordenador.getCursos(req.params.id);
    res.json(cursos);
  } catch (err) {
    logError('Erro getCursos coordenador: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.addCurso = async (req, res) => {
  try {
    if (!req.body.idCurso) return res.status(400).json({ message: 'O ID do curso é obrigatório.' });
    const [rows] = await Coordenador.findById(req.params.id);
    if (!rows || !rows.length) return res.status(404).json({ message: 'Coordenador não encontrado.' });
    await Coordenador.addCurso(req.params.id, req.body.idCurso);
    res.status(201).json({ message: 'Curso associado' });
  } catch (err) {
    logError('Erro addCurso coordenador: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.removeCurso = async (req, res) => {
  try {
    const [rows] = await Coordenador.findById(req.params.id);
    if (!rows || !rows.length) return res.status(404).json({ message: 'Coordenador não encontrado.' });
    await Coordenador.removeCurso(req.params.id, req.params.idCurso);
    res.json({ message: 'Curso desassociado' });
  } catch (err) {
    logError('Erro removeCurso coordenador: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.avaliarSubmissao = async (req, res) => {
  try {
    const { idSubmissao } = req.params;
    const { status, observacao } = req.body;
    if (!['aprovada', 'rejeitada'].includes(status)) {
      return res.status(400).json({ message: 'Status inválido. Use "aprovada" ou "rejeitada".' });
    }
    const [rows] = await Submissao.findById(idSubmissao);
    if (!rows || !rows.length) return res.status(404).json({ message: 'Submissão não encontrada.' });
    if (rows[0].status !== 'pendente') {
      return res.status(409).json({ message: 'Submissão já foi avaliada anteriormente.' });
    }
    req.params.id = idSubmissao;
    req.body = { status, observacao };
    return submissaoController.updateStatus(req, res);
  } catch (err) {
    logError('Erro avaliarSubmissao coordenador: ' + err.message);
    res.status(500).json({ message: 'Erro interno ao avaliar submissão.' });
  }
};