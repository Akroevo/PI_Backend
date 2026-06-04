const db = require('../config/db');
const AppError = require('../utils/AppError');

exports.getDashboardAluno = async (req, res) => {
  const idUsuario = req.usuario.id;

  const [[aluno]] = await db.query(
    'SELECT matricula FROM aluno WHERE usuario_idusuario = ?',
    [idUsuario]
  );

  if (!aluno) {
    throw new AppError('Aluno não encontrado.', 404, 'ERR_ALUNO_NOT_FOUND');
  }

  const [[statusSubmissoes]] = await db.query(`
    SELECT
      COUNT(*)                         AS total,
      SUM(s.status = 'aprovada')       AS aprovadas,
      SUM(s.status = 'rejeitada')      AS rejeitadas,
      SUM(s.status = 'pendente')       AS pendentes
    FROM submissao s
    JOIN atividadecomplementar a ON a.idAtividade = s.atividade_idAtividade
    WHERE a.aluno_matricula = ?
  `, [aluno.matricula]);

  const [[horas]] = await db.query(`
    SELECT
      COALESCE(SUM(a.cargaHorariaSolicitada), 0) AS totalHorasSolicitadas,
      COALESCE(SUM(
        CASE WHEN s.status = 'aprovada'
        THEN a.cargaHorariaSolicitada ELSE 0 END
      ), 0) AS totalHorasAprovadas
    FROM atividadecomplementar a
    LEFT JOIN submissao s ON s.atividade_idAtividade = a.idAtividade
    WHERE a.aluno_matricula = ?
  `, [aluno.matricula]);

  const [categorias] = await db.query(`
    SELECT 
      tc.nome AS categoria,
      COALESCE(SUM(a.cargaHorariaSolicitada), 0) AS horasSolicitadas,
      COALESCE(SUM(
        CASE WHEN s.status = 'aprovada' 
        THEN a.cargaHorariaSolicitada ELSE 0 END
      ), 0) AS horasAprovadas
    FROM tipocategoria tc
    LEFT JOIN atividadecomplementar a ON a.tipoCategoria_idTipo = tc.idTipo AND a.aluno_matricula = ?
    LEFT JOIN submissao s ON s.atividade_idAtividade = a.idAtividade
    WHERE tc.nome IN ('Curso', 'Palestra', 'Experiência Profissional', 'Evento')
    GROUP BY tc.idTipo, tc.nome
  `, [aluno.matricula]);

  res.json({
    submissoes: {
      total:      Number(statusSubmissoes.total),
      aprovadas:  Number(statusSubmissoes.aprovadas),
      rejeitadas: Number(statusSubmissoes.rejeitadas),
      pendentes:  Number(statusSubmissoes.pendentes),
    },
    horas: {
      solicitadas: Number(horas.totalHorasSolicitadas),
      aprovadas:   Number(horas.totalHorasAprovadas),
    },
    categorias: categorias.map(cat => ({
      categoria: cat.categoria,
      solicitadas: Number(cat.horasSolicitadas),
      aprovadas: Number(cat.horasAprovadas)
    }))
  });
};
