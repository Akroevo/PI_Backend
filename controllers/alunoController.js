const Aluno = require('../models/alunoModel');
const db = require('../database/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await Aluno.findAll();
    const alunos = await Promise.all(rows.map(async (aluno) => {
      const [cursos] = await Aluno.getCursos(aluno.matricula);
      return { ...aluno, cursos };
    }));
    res.json(alunos);
  } catch (err) {
    console.error('Erro getAll aluno:', err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await Aluno.findById(req.params.matricula);
    if (!rows.length) return res.status(404).json({ message: 'Não encontrado' });
    const [cursos] = await Aluno.getCursos(req.params.matricula);
    res.json({ ...rows[0], cursos });
  } catch (err) {
    console.error('Erro getById aluno:', err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    await Aluno.create(req.body);
    res.status(201).json({ message: 'Aluno criado com sucesso' });
  } catch (err) {
    console.error('Erro create aluno:', err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    await Aluno.update(req.params.matricula, req.body);

    if (req.body.email) {
      const [rows] = await Aluno.findById(req.params.matricula);
      if (rows.length && rows[0].usuario_idusuario) {
        await db.query('UPDATE usuario SET email=? WHERE idusuario=?', [req.body.email, rows[0].usuario_idusuario]);
      }
    }

    if (req.body.cursos !== undefined) {
      await Aluno.removeTodosCursos(req.params.matricula);
      for (const idCurso of req.body.cursos) {
        await Aluno.addCurso(req.params.matricula, idCurso);
      }
    }

    res.json({ message: 'Atualizado' });
  } catch (err) {
    console.error('Erro update aluno:', err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Aluno.delete(req.params.matricula);
    res.json({ message: 'Removido' });
  } catch (err) {
    console.error('Erro remove aluno:', err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.getCursos = async (req, res) => {
  try {
    const [rows] = await Aluno.getCursos(req.params.matricula);
    res.json(rows);
  } catch (err) {
    console.error('Erro getCursos aluno:', err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.addCurso = async (req, res) => {
  try {
    await Aluno.addCurso(req.params.matricula, req.body.idCurso);
    res.status(201).json({ message: 'Matriculado no curso' });
  } catch (err) {
    console.error('Erro addCurso aluno:', err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.removeCurso = async (req, res) => {
  try {
    await Aluno.removeCurso(req.params.matricula, req.params.idCurso);
    res.json({ message: 'Desmatriculado do curso' });
  } catch (err) {
    console.error('Erro removeCurso aluno:', err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};