const db = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const [rows] = await db.query('SELECT * FROM usuario WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Email ou senha inválidos' });

    const usuario = rows[0];

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) return res.status(401).json({ message: 'Email ou senha inválidos' });

    const tipoNormalizado = usuario.tipo_usuario.trim().toLowerCase();

    let idCoordenador = null;
    if (tipoNormalizado === 'coordenador') {
      const [coord] = await db.query(
        'SELECT idCoordenador FROM coordenador WHERE usuario_idusuario = ?',
        [usuario.idusuario]
      );
      if (coord.length) idCoordenador = coord[0].idCoordenador;
    }

    let matricula = null;
    if (tipoNormalizado === 'aluno') {
      const [aluno] = await db.query(
        'SELECT matricula FROM aluno WHERE usuario_idusuario = ?',
        [usuario.idusuario]
      );
      if (aluno.length) matricula = aluno[0].matricula;
    }

    const token = jwt.sign(
      {
        idusuario: usuario.idusuario,
        tipo_usuario: tipoNormalizado,
        email: usuario.email,
        idCoordenador,
        matricula
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, tipo_usuario: tipoNormalizado });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};