exports.getDashboardAluno = async (req, res) => {
  try {
    const idUsuario = req.usuario.id; 

    const [[aluno]] = await db.query(
      'SELECT matricula FROM aluno WHERE usuario_idusuario = ?',
      [idUsuario]
    );

    if (!aluno) return res.status(404).json({ message: 'Aluno não encontrado' });

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
    });
  } catch (err) {
    console.error('Erro dashboard aluno:', err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};