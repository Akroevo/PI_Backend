const Submissao   = require('../models/submissaoModel');
const Notificacao = require('../models/notificacaoModel');
const Certificado = require('../models/certificadoModel');
const db          = require('../database/db');
const nodemailer  = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   process.env.MAIL_HOST,
  port:   Number(process.env.MAIL_PORT) || 587,
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function emailParaCoordenador(nomeAluno, nomeAtividade) {
  return {
    assunto: `Nova submissão de certificado — ${nomeAluno}`,
    corpo: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h2 style="color:#378ADD">Nova submissão para avaliar</h2>
        <p>O aluno <strong>${nomeAluno}</strong> enviou um certificado para a atividade <strong>${nomeAtividade}</strong>.</p>
        <p>Acesse o sistema para aprovar ou rejeitar.</p>
        <p style="color:#888;font-size:12px">Mensagem automática, não responda.</p>
      </div>
    `,
  };
}

function emailParaAluno(status, nomeAluno, observacao) {
  const aprovada = status === 'aprovada';
  return {
    assunto: `Sua atividade foi ${aprovada ? 'aprovada ✅' : 'rejeitada ❌'}`,
    corpo: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h2 style="color:${aprovada ? '#1D9E75' : '#E24B4A'}">
          Atividade ${aprovada ? 'aprovada ✅' : 'rejeitada ❌'}
        </h2>
        <p>Olá, <strong>${nomeAluno}</strong>!</p>
        <p>Sua submissão foi <strong>${aprovada ? 'aprovada' : 'rejeitada'}</strong> pelo coordenador.</p>
        ${observacao ? `<p><strong>Observação:</strong> ${observacao}</p>` : ''}
        <p style="color:#888;font-size:12px">Mensagem automática, não responda.</p>
      </div>
    `,
  };
}



exports.getAll = async (req, res) => {
  const [rows] = await Submissao.findAll();
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [rows] = await Submissao.findById(req.params.id);
  if (!rows.length) return res.status(404).json({ message: 'Não encontrado' });
  res.json(rows[0]);
};

exports.getByCoordenador = async (req, res) => {
  const [rows] = await Submissao.findByCoordenador(req.params.idCoordenador);
  res.json(rows);
};

exports.getByAtividade = async (req, res) => {
  const [rows] = await Submissao.findByAtividade(req.params.idAtividade);
  res.json(rows);
};


exports.create = async (req, res) => {
  try {
    const [result] = await Submissao.create(req.body);
    const idSubmissao = result.insertId;

    const [[dados]] = await db.query(
      `SELECT
         al.nome                   AS nomeAluno,
         a.titulo                  AS nomeAtividade,
         c.email                   AS emailCoordenador
       FROM submissao s
       JOIN atividadecomplementar a ON a.idAtividade       = s.atividade_idAtividade
       JOIN aluno                 al ON al.matricula        = a.aluno_matricula
       JOIN coordenador            c ON c.idCoordenador     = s.coordenador_idCoordenador
       WHERE s.idSubmissao = ?`,
      [idSubmissao]
    );

    if (dados?.emailCoordenador) {
      const { assunto, corpo } = emailParaCoordenador(dados.nomeAluno, dados.nomeAtividade);

      await transporter.sendMail({
        from:    `"Sistema de Certificados" <${process.env.MAIL_USER}>`,
        to:      dados.emailCoordenador,
        subject: assunto,
        html:    corpo,
      });

      await Notificacao.create({
        submissao_idSubmissao: idSubmissao,
        destinatario:          dados.emailCoordenador,
        assunto,
        corpo,
        dataEnvio:             new Date(),
      });
    }

    res.status(201).json({ id: idSubmissao });
  } catch (err) {
    console.error('Erro create submissao:', err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};


exports.updateStatus = async (req, res) => {
  try {
    const { status, observacao } = req.body;

    const statusPermitidos = ['aprovada', 'rejeitada', 'pendente'];
    if (!statusPermitidos.includes(status)) {
      return res.status(400).json({ message: 'Status inválido.' });
    }

    await Submissao.updateStatus(req.params.id, status, observacao);

    const [[dadosAluno]] = await db.query(
      `SELECT u.email, al.nome
       FROM submissao s
       JOIN atividadecomplementar a  ON a.idAtividade  = s.atividade_idAtividade
       JOIN aluno                 al ON al.matricula   = a.aluno_matricula
       JOIN usuario                u ON u.idusuario    = al.usuario_idusuario
       WHERE s.idSubmissao = ?`,
      [req.params.id]
    );

    if (!dadosAluno) {
      return res.status(404).json({ message: 'Aluno não encontrado para esta submissão.' });
    }

    if (['aprovada', 'rejeitada'].includes(status)) {
      const { assunto, corpo } = emailParaAluno(status, dadosAluno.nome, observacao);

      await transporter.sendMail({
        from:    `"Sistema de Certificados" <${process.env.MAIL_USER}>`,
        to:      dadosAluno.email,
        subject: assunto,
        html:    corpo,
      });

      await Notificacao.create({
        submissao_idSubmissao: req.params.id,
        destinatario:          dadosAluno.email,
        assunto,
        corpo,
        dataEnvio:             new Date(),
      });
    }

    if (status === 'aprovada') {
      const [[atividade]] = await db.query(
        `SELECT a.cargaHorariaSolicitada, a.aluno_matricula
         FROM atividadecomplementar a
         JOIN submissao s ON s.atividade_idAtividade = a.idAtividade
         WHERE s.idSubmissao = ?`,
        [req.params.id]
      );

      await db.query(
        'UPDATE aluno SET cargaHorariaAcumulada = cargaHorariaAcumulada + ? WHERE matricula = ?',
        [atividade.cargaHorariaSolicitada, atividade.aluno_matricula]
      );

      await Certificado.create({
        submissao_idSubmissao: req.params.id,
        nomeArquivo:           `certificado_${req.params.id}.pdf`,
        caminhoArquivo:        `/certificados/certificado_${req.params.id}.pdf`,
        textoOCR:              null,
      });
    }

    res.json({ message: 'Status atualizado' });

  } catch (err) {
    console.error('Erro updateStatus:', err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.remove = async (req, res) => {
  await Submissao.delete(req.params.id);
  res.json({ message: 'Removido' });
};
