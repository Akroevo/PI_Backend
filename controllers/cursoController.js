const Curso = require('../models/cursoModel');
const { error: logError } = require('../middlewares/logger');

const tiposValidos = ['EAD', 'Presencial', 'Hibrido'];
const turnosValidos = ['Manha', 'Tarde', 'Noite'];

function normalizar(valor) {
  return String(valor || '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function resolverEnum(valor, validos) {
  const norm = normalizar(valor);
  return validos.find((v) => normalizar(v) === norm) || null;
}

exports.getAll = async (req, res) => {
  try {
    const [rows] = await Curso.findAll();
    res.json(rows);
  } catch (err) {
    logError('Erro getAll curso: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await Curso.findById(req.params.id);

    if (!rows || !rows.length) {
      return res.status(404).json({ message: 'Curso não encontrado.' });
    }

    res.json(rows);
  } catch (err) {
    logError('Erro getById curso: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nome, tipoCurso, turno } = req.body;

    if (!nome || !tipoCurso || !turno) {
      return res.status(400).json({ message: 'Campos obrigatórios ausentes.' });
    }

    const tipoResolvido = resolverEnum(tipoCurso, tiposValidos);
    if (!tipoResolvido) {
      return res.status(400).json({ message: `tipoCurso inválido. Use: ${tiposValidos.join(', ')}` });
    }

    const turnoResolvido = resolverEnum(turno, turnosValidos);
    if (!turnoResolvido) {
      return res.status(400).json({ message: `turno inválido. Use: ${turnosValidos.join(', ')}` });
    }

    const [result] = await Curso.create({ ...req.body, tipoCurso: tipoResolvido, turno: turnoResolvido });
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    logError('Erro create curso: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { tipoCurso, turno } = req.body;

    const [rows] = await Curso.findById(req.params.id);
    if (!rows || !rows.length) {
      return res.status(404).json({ message: 'Curso não encontrado para atualização.' });
    }

    const dadosAtualizados = { ...rows[0], ...req.body };

    if (tipoCurso !== undefined) {
      const tipoResolvido = resolverEnum(tipoCurso, tiposValidos);
      if (!tipoResolvido) {
        return res.status(400).json({ message: `tipoCurso inválido. Use: ${tiposValidos.join(', ')}` });
      }
      dadosAtualizados.tipoCurso = tipoResolvido;
    }

    if (turno !== undefined) {
      const turnoResolvido = resolverEnum(turno, turnosValidos);
      if (!turnoResolvido) {
        return res.status(400).json({ message: `turno inválido. Use: ${turnosValidos.join(', ')}` });
      }
      dadosAtualizados.turno = turnoResolvido;
    }

    await Curso.update(req.params.id, dadosAtualizados);
    res.json({ message: 'Atualizado com sucesso' });
  } catch (err) {
    logError('Erro update curso: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const [rows] = await Curso.findById(req.params.id);
    if (!rows || !rows.length) {
      return res.status(404).json({ message: 'Curso não encontrado para remoção.' });
    }

    await Curso.delete(req.params.id);
    res.json({ message: 'Removido com sucesso' });
  } catch (err) {
    logError('Erro remove curso: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};