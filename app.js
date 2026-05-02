require('./database/db');
const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const app = express();

app.use(express.json());
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(morgan('dev'));


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
app.use('/api/superadmins',   require('./routes/superadminRoutes'));

module.exports = app;