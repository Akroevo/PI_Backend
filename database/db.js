require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT, 
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: true
});


(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('Conectado ao banco para verificar estrutura...');
    
    const schemaPath = path.join(__dirname, '../sql/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
      await conn.query(schemaSQL);
      console.log('Estrutura do banco verificada com sucesso!');
    }
    conn.release();
  } catch (err) {
    console.error('Erro ao preparar banco:', err.message);
  }
})();


module.exports = pool;