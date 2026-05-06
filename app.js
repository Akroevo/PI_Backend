require('./database/db');
const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { autorizar } = require('./middlewares/auth');
const app = express();
const { logger, logsEmMemoria } = require('./middlewares/logger');

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
app.use('/api/superadmins', require('./routes/superAdminRoutes'));


app.get('/api/logs', autorizar('superadmin'), (req, res) => {
  res.json(logsEmMemoria);

});
  module.exports = app;