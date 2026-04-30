require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });
    const schemaPath = path.join(__dirname, '../sql/schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    await conn.query(schemaSQL);
    await conn.end();
    console.log('Banco e estrutura criados/verificados com sucesso');
  } catch (err) {
    console.error('Erro ao preparar banco:', err.message);
  }
})();
