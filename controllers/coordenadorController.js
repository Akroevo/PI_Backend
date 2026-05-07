exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const [rows] = await db.query('SELECT * FROM usuario WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Email ou senha inválidos' });

    const usuario = rows[0];

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) return res.status(401).json({ message: 'Email ou senha inválidos' });

    // Busca idCoordenador se for coordenador
    let idCoordenador = null;
    if (usuario.tipo_usuario === 'coordenador') {
      const [coord] = await db.query(
        'SELECT idCoordenador FROM coordenador WHERE usuario_idusuario = ?',
        [usuario.idusuario]
      );
      if (coord.length) idCoordenador = coord[0].idCoordenador;
    }

    const token = jwt.sign(
      {
        idusuario: usuario.idusuario,
        tipo_usuario: usuario.tipo_usuario,
        email: usuario.email,
        idCoordenador 
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, tipo_usuario: usuario.tipo_usuario });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};