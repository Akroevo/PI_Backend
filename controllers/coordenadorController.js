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

// Cria usuário (tipo_usuario='coordenador') + coordenador + vínculos de curso
// em UMA ÚNICA transação. Se qualquer passo falhar, tudo é desfeito (rollback)
// e nenhum estado "pela metade" é deixado no banco.
exports.create = async (req, res) => {
  const nome = typeof req.body.nome === 'string' ? req.body.nome.trim() : '';
  const usuarioId = Number(req.body.usuario_idusuario);
  const telefone = req.body.telefone ?? null;
  const email = typeof req.body.email === 'string' ? req.body.email.trim() : null;

  if (!nome) {
    return res.status(400).json({ message: 'Campo "nome" é obrigatório.' });
  }
  if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
    return res.status(400).json({ message: 'Campo "usuario_idusuario" é obrigatório e deve ser um ID válido.' });
  }
  if (email && !email.includes('@')) {
    return res.status(400).json({ message: 'E-mail inválido.' });
  }
  if (req.body.cursos !== undefined && !Array.isArray(req.body.cursos)) {
    return res.status(400).json({ message: 'Campo "cursos" deve ser uma lista de IDs.' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // FOR UPDATE trava a linha (se existir) até o commit/rollback,
    // evitando que duas requisições concorrentes criem coordenadores
    // duplicados para o mesmo usuário.
    const [existing] = await conn.query(
      'SELECT idCoordenador FROM coordenador WHERE usuario_idusuario = ? FOR UPDATE',
      [usuarioId]
    );
    if (existing.length) {
      await conn.rollback();
      return res.status(409).json({ message: 'Já existe um coordenador para esse usuário.' });
    }

    const [usuarioUpdate] = await conn.query(
      'UPDATE usuario SET tipo_usuario = ? WHERE idusuario = ?',
      ['coordenador', usuarioId]
    );
    if (usuarioUpdate.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const [result] = await Coordenador.create(
      { nome, usuario_idusuario: usuarioId, telefone, email },
      conn
    );
    const idCoordenador = result.insertId;

    if (req.body.cursos?.length > 0) {
      for (const idCurso of req.body.cursos) {
        await Coordenador.addCurso(idCoordenador, idCurso, conn);
      }
    }

    await conn.commit();
    res.status(201).json({ id: idCoordenador });
  } catch (err) {
    await conn.rollback();
    logError('Erro create coordenador: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  } finally {
    conn.release();
  }
};

// Atualiza coordenador + vínculos de curso em uma única transação.
exports.update = async (req, res) => {
  if (req.body.nome !== undefined && !String(req.body.nome).trim()) {
    return res.status(400).json({ message: 'Campo "nome" não pode ser vazio.' });
  }
  if (req.body.cursos !== undefined && !Array.isArray(req.body.cursos)) {
    return res.status(400).json({ message: 'Campo "cursos" deve ser uma lista de IDs.' });
  }

  const conn = await db.getConnection();
  try {
    const [rows] = await Coordenador.findById(req.params.id);
    if (!rows || !rows.length) {
      return res.status(404).json({ message: 'Coordenador não encontrado para atualização.' });
    }

    await conn.beginTransaction();

    await Coordenador.update(req.params.id, req.body, conn);

    if (req.body.cursos !== undefined) {
      await Coordenador.removeTodosCursos(req.params.id, conn);
      for (const idCurso of req.body.cursos) {
        await Coordenador.addCurso(req.params.id, idCurso, conn);
      }
    }

    await conn.commit();
    res.json({ message: 'Atualizado com sucesso' });
  } catch (err) {
    await conn.rollback();
    logError('Erro update coordenador: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  } finally {
    conn.release();
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
