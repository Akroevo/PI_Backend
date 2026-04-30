require('dotenv').config();
const express = require('express');
const app = express();

require('./database/db');

app.use(express.json());

app.use('/usuarios', require('./routes/usuarioRoutes'));
app.use('/cursos', require('./routes/cursoRoutes'));
app.use('/regras', require('./routes/regraRoutes'));
app.use('/atividades', require('./routes/atividadeRoutes'));

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});