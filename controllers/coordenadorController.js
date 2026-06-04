const Coordenador = require('../models/coordenadorModel');
const Submissao   = require('../models/submissaoModel');
const submissaoController = require('./submissaoController');
 
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
  const idCoordenador = result.insertId;
  if (req.body.cursos?.length > 0) {
    for (const idCurso of req.body.cursos) {
      await Coordenador.addCurso(idCoordenador, idCurso);
    }
  }
  res.status(201).json({ id: idCoordenador });
};
 
exports.update = async (req, res) => {
  await Coordenador.update(req.params.id, req.body);
  if (req.body.cursos !== undefined) {
    await Coordenador.removeTodosCursos(req.params.id);
    for (const idCurso of req.body.cursos) {
      await Coordenador.addCurso(req.params.id, idCurso);
    }
  }
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
 
exports.avaliarSubmissao = async (req, res) => {
  try {
    const { idSubmissao } = req.params;
    const { status, observacao } = req.body;
 
    if (!['aprovada', 'rejeitada'].includes(status)) {
      return res.status(400).json({ message: 'Status inválido. Use "aprovada" ou "rejeitada".' });
    }
 
    const [rows] = await Submissao.findById(idSubmissao);
    if (!rows.length) {
      return res.status(404).json({ message: 'Submissão não encontrada.' });
    }
 
    if (rows[0].status !== 'pendente') {
      return res.status(409).json({ message: 'Submissão já foi avaliada anteriormente.' });
    }

    req.params.id = idSubmissao;
    req.body      = { status, observacao };
    return submissaoController.updateStatus(req, res);
 
  } catch (err) {
    console.error('Erro avaliarSubmissao:', err.message);
    res.status(500).json({ message: 'Erro ao avaliar submissão', error: err.message });
  }
};
 
