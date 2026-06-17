require('./database/db');
const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { autorizar, apenasProprioAluno } = require('./middlewares/auth');
const { logger } = require('./middlewares/logger');
const cors = require('cors');
const db = require('./database/db');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(morgan('dev', {
  stream: { write: (msg) => logger.info(msg.trim()) }
}));

app.use('/api/auth',          require('./routes/authRoutes'));
app.use('/api/usuarios',      require('./routes/usuarioRoutes'));
app.use('/api/alunos',        require('./routes/alunoRoutes'));
app.use('/api/cursos',        require('./routes/cursoRoutes'));
app.use('/api/regras',        require('./routes/regraRoutes'));
app.use('/api/atividades',    require('./routes/atividadeRoutes'));
app.use('/api/coordenadores', require('./routes/coordenadorRoute'));
app.use('/api/submissoes',    require('./routes/submissaoRoutes'));
app.use('/api/certificados',  require('./routes/certificadoRoutes'));
app.use('/api/notificacoes',  require('./routes/notificacaoRoutes'));
app.use('/api/superadmins',   require('./routes/superAdminRoutes'));

app.get('/api/logs', autorizar('superadmin'), async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM log ORDER BY timestamp DESC LIMIT 200');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
});


app.get('/api/dashboard/aluno', apenasProprioAluno, async (req, res) => {
  try {
    const matricula = req.usuario.matricula;

    const [[aluno]] = await db.query(
      `SELECT a.nome, a.cargaHorariaAcumulada, a.matricula
       FROM aluno a WHERE a.matricula = ?`,
      [matricula]
    );

    const [cursos] = await db.query(
      `SELECT c.* FROM curso c
       JOIN aluno_curso ac ON ac.curso_idCurso = c.idCurso
       WHERE ac.aluno_matricula = ?`,
      [matricula]
    );

    const [atividades] = await db.query(
      `SELECT a.*, s.status AS statusSubmissao, s.observacao, s.urlCertificado
       FROM atividadecomplementar a
       LEFT JOIN submissao s ON s.atividade_idAtividade = a.idAtividade
       WHERE a.aluno_matricula = ?`,
      [matricula]
    );

    const pendentes = atividades.filter(a => a.statusSubmissao === 'pendente').length;
    const aprovadas = atividades.filter(a => a.statusSubmissao === 'aprovada').length;

    res.json({ aluno, cursos, atividades, pendentes, aprovadas });
  } catch (err) {
    console.error('Erro dashboard aluno:', err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
});

module.exports = app;