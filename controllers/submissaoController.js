const Submissao = require('../models/submissaoModel');
const Notificacao = require('../models/notificacaoModel');
const Certificado = require('../models/certificadoModel');
const db = require('../database/db');
const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  }
});


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
  const [result] = await Submissao.create(req.body);
  res.status(201).json({ id: result.insertId });
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, observacao, emailAluno } = req.body;

    
    await Submissao.updateStatus(req.params.id, status, observacao);

    const assunto = `Sua atividade foi ${status}`;
    const corpo = `Olá! Sua submissão foi ${status}. Observação: ${observacao || 'Nenhuma'}`;

    
    console.log(`Enviando email para: ${emailAluno}`);
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: emailAluno,
      subject: assunto,
      text: corpo
    });
    console.log('Email enviado com sucesso!');

    
    await Notificacao.create({
      submissao_idSubmissao: req.params.id,
      destinatario: emailAluno,
      assunto,
      corpo
    });

    if (status === 'aprovada') {
      const [atividade] = await db.query(
    `SELECT a.cargaHorariaSolicitada, a.aluno_matricula 
     FROM atividadecomplementar a
     JOIN submissao s ON s.atividade_idAtividade = a.idAtividade
     WHERE s.idSubmissao = ?`,
    [req.params.id]
  );
  await db.query(
    'UPDATE aluno SET cargaHorariaAcumulada = cargaHorariaAcumulada + ? WHERE matricula = ?',
    [atividade[0].cargaHorariaSolicitada, atividade[0].aluno_matricula]
  );
  console.log('Carga horária acumulada atualizada!');

    await Certificado.create({
    submissao_idSubmissao: req.params.id,
    nomeArquivo: `certificado_${req.params.id}.pdf`,
    caminhoArquivo: `/certificados/certificado_${req.params.id}.pdf`,
    textoOCR: null
  });
  console.log('Certificado gerado!');
 }
    res.json({ message: 'Status atualizado e email enviado' });

  } catch (err) {
    console.error('Erro:', err.message);
    res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

exports.remove = async (req, res) => {
  await Submissao.delete(req.params.id);
  res.json({ message: 'Removido' }); 
};