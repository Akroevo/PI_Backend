const Submissao   = require('../models/submissaoModel');
const Notificacao = require('../models/notificacaoModel');
const Certificado = require('../models/certificadoModel');
const db          = require('../database/db');
const { Resend }  = require('resend');
const cloudinary  = require('cloudinary').v2;
const Tesseract   = require('tesseract.js');
const { error: logError } = require('../middlewares/logger');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const resend = new Resend(process.env.RESEND_API_KEY);

async function extrairTextoOCR(buffer) {
  try {
    const { data: { text } } = await Tesseract.recognize(buffer, 'por', { logger: () => {} });
    return text || null;
  } catch (err) {
    logError('Erro OCR Tesseract: ' + err.message);
    return null;
  }
}

function extrairHorasDoTexto(texto) {
  if (!texto) return null;
  const match = texto.match(/(\d{1,4})\s*h(ora[s]?)?/i);
  return match ? parseInt(match[1]) : null;
}

async function enviarERegistrarEmail({ destinatario, assunto, corpo, submissaoIdParaLog }) {
  try {
    await resend.emails.send({
      from:    'Sistema de Certificados <onboarding@resend.dev>',
      to:      destinatario,
      subject: assunto,
      html:    corpo,
    });

    await Notificacao.create({
      submissao_idSubmissao: submissaoIdParaLog,
      destinatario,
      assunto,
      corpo,
      dataEnvio: new Date(),
    });
  } catch (err) {
    logError(`Erro envio de email para ${destinatario} (submissao ${submissaoIdParaLog}): ` + err.message);
  }
}

function emailParaCoordenador(nomeAluno, nomeAtividade, urlCertificado) {
  return {
    assunto: `Nova submissão de certificado — ${nomeAluno}`,
    corpo: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h2 style="color:#378ADD">Nova submissão para avaliar</h2>

        <p>
          O aluno <strong>${nomeAluno}</strong>
          enviou um certificado para a atividade
          <strong>${nomeAtividade}</strong>.
        </p>

        <p>
          <a
            href="${urlCertificado}"
            target="_blank"
            style="
              background:#378ADD;
              color:white;
              padding:12px 20px;
              text-decoration:none;
              border-radius:6px;
              display:inline-block;
            "
          >
            Visualizar Certificado
          </a>
        </p>

        <p>
          Acesse o sistema para aprovar ou rejeitar a atividade.
        </p>

        <p style="color:#888;font-size:12px">
          Mensagem automática, não responda.
        </p>
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
  try {
    const [rows] = await Submissao.findAll();
    res.json(rows);
  } catch (err) {
    logError('Erro getAll submissao: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await Submissao.findById(req.params.id);
    if (!rows.length) return res.status(404).json({ message: 'Não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    logError('Erro getById submissao: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.getByCoordenador = async (req, res) => {
  try {
    const [rows] = await Submissao.findByCoordenador(req.params.idCoordenador);
    res.json(rows);
  } catch (err) {
    logError('Erro getByCoordenador submissao: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.getByAtividade = async (req, res) => {
  try {
    const [rows] = await Submissao.findByAtividade(req.params.idAtividade);
    res.json(rows);
  } catch (err) {
    logError('Erro getByAtividade submissao: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    let urlCertificado = null;
    let textoOCR = null;
    let horasOCR = null;

    if (req.file) {
      const uploaded = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'certificados', resource_type: 'auto' },
          (error, result) => error ? reject(error) : resolve(result)
        );
        stream.end(req.file.buffer);
      });
      urlCertificado = uploaded.secure_url;

      textoOCR = await extrairTextoOCR(req.file.buffer);
      horasOCR = extrairHorasDoTexto(textoOCR);
    }

    const idAtividade = req.body.atividade_idAtividade;
    const [[coordResult]] = await db.query(
      `SELECT cc.coordenador_idCoordenador
       FROM atividadecomplementar a
       JOIN regrasdocurso r ON r.idRegra = a.regra_idRegra
       JOIN coordenador_curso cc ON cc.curso_idCurso = r.curso_idCurso
       WHERE a.idAtividade = ?
       LIMIT 1`,
      [idAtividade]
    );

    if (!coordResult) {
      return res.status(400).json({ message: 'Nenhum coordenador encontrado para o curso desta atividade.' });
    }

    const coordenador_idCoordenador = coordResult.coordenador_idCoordenador;

    const [result] = await Submissao.create({ ...req.body, coordenador_idCoordenador, urlCertificado });
    const idSubmissao = result.insertId;

    await Certificado.create({
      submissao_idSubmissao: idSubmissao,
      nomeArquivo:           req.file?.originalname || `certificado_${idSubmissao}`,
      caminhoArquivo:        urlCertificado || '',
      textoOCR,
    });

    const [[dados]] = await db.query(
      `SELECT
         al.nome                AS nomeAluno,
         a.titulo               AS nomeAtividade,
         c.email                AS emailCoordenador
       FROM submissao s
       JOIN atividadecomplementar a ON a.idAtividade     = s.atividade_idAtividade
       JOIN aluno                al ON al.matricula      = a.aluno_matricula
       JOIN coordenador           c ON c.idCoordenador   = s.coordenador_idCoordenador
       WHERE s.idSubmissao = ?`,
      [idSubmissao]
    );

    if (dados?.emailCoordenador) {
      const { assunto, corpo } = emailParaCoordenador(dados.nomeAluno, dados.nomeAtividade);
      await enviarERegistrarEmail({
        destinatario: dados.emailCoordenador,
        assunto,
        corpo,
        submissaoIdParaLog: idSubmissao,
      });
    }

    res.status(201).json({ id: idSubmissao, urlCertificado, textoOCR, horasOCR });
  } catch (err) {
    logError('Erro create submissao: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, observacao, horasAprovadas } = req.body;

    const statusPermitidos = ['aprovada', 'rejeitada', 'pendente'];
    if (!statusPermitidos.includes(status)) {
      return res.status(400).json({ message: 'Status inválido.' });
    }

    await Submissao.updateStatus(req.params.id, status, observacao);

    const [[dadosAluno]] = await db.query(
      `SELECT u.email, al.nome
       FROM submissao s
       JOIN atividadecomplementar a  ON a.idAtividade = s.atividade_idAtividade
       JOIN aluno                 al ON al.matricula  = a.aluno_matricula
       JOIN usuario                u ON u.idusuario   = al.usuario_idusuario
       WHERE s.idSubmissao = ?`,
      [req.params.id]
    );

    if (!dadosAluno) {
      return res.status(404).json({ message: 'Aluno não encontrado para esta submissão.' });
    }

    if (['aprovada', 'rejeitada'].includes(status)) {
      const { assunto, corpo } = emailParaAluno(status, dadosAluno.nome, observacao);
      await enviarERegistrarEmail({
        destinatario: dadosAluno.email,
        assunto,
        corpo,
        submissaoIdParaLog: req.params.id,
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

      const horasFinais = horasAprovadas || atividade.cargaHorariaSolicitada;

      await db.query(
        'UPDATE submissao SET cargaHorariaAprovada = ? WHERE idSubmissao = ?',
        [horasFinais, req.params.id]
      );

      await db.query(
        'UPDATE aluno SET cargaHorariaAcumulada = cargaHorariaAcumulada + ? WHERE matricula = ?',
        [horasFinais, atividade.aluno_matricula]
      );

      const [[submissao]] = await db.query(
        'SELECT urlCertificado FROM submissao WHERE idSubmissao = ?',
        [req.params.id]
      );

      await Certificado.create({
        submissao_idSubmissao: req.params.id,
        nomeArquivo:           `certificado_${req.params.id}.pdf`,
        caminhoArquivo:        submissao?.urlCertificado || '',
        textoOCR:              null,
      });
    }

    res.json({ message: 'Status atualizado' });
  } catch (err) {
    logError('Erro updateStatus: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Submissao.delete(req.params.id);
    res.json({ message: 'Removido' });
  } catch (err) {
    logError('Erro remove submissao: ' + err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};