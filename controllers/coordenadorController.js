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
  const idCoordenador = result.insertId;

  if (req.body.cursos && req.body.cursos.length > 0) {
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