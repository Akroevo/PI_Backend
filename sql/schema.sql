SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;

CREATE SCHEMA IF NOT EXISTS `spheredu` DEFAULT CHARACTER SET utf8mb4;
USE `spheredu`;

-- USUARIO
CREATE TABLE usuario (
  idusuario INT AUTO_INCREMENT PRIMARY KEY,
  login VARCHAR(45) NOT NULL,
  senha VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  telefone VARCHAR(20) NOT NULL,
  tipo_usuario ENUM('superadmin','coordenador','aluno') NOT NULL
);

-- ALUNO
CREATE TABLE aluno (
  matricula INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  dataEntrada DATE NOT NULL,
  cargaHorariaAcumulada INT DEFAULT 0,
  usuario_idusuario INT UNIQUE,
  FOREIGN KEY (usuario_idusuario)
    REFERENCES usuario(idusuario)
    ON DELETE CASCADE
);

-- CURSO
CREATE TABLE curso (
  idCurso INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  tipoCurso ENUM('EAD', 'Presencial', 'Hibrido'),
  cargaHorariaTotal INT,
  categoria VARCHAR(45)
);

-- ALUNO_CURSO
CREATE TABLE aluno_curso (
  aluno_matricula INT,
  curso_idCurso INT,
  PRIMARY KEY (aluno_matricula, curso_idCurso),
  FOREIGN KEY (aluno_matricula) REFERENCES aluno(matricula) ON DELETE CASCADE,
  FOREIGN KEY (curso_idCurso) REFERENCES curso(idCurso) ON DELETE CASCADE
);

-- REGRAS
CREATE TABLE regrasdocurso (
  idRegra INT AUTO_INCREMENT PRIMARY KEY,
  curso_idCurso INT,
  categoria VARCHAR(60),
  cargaHorariaMin INT,
  cargaHorariaMax INT,
  cargaHorariaPermitida INT,
  descricao VARCHAR(200),
  FOREIGN KEY (curso_idCurso) REFERENCES curso(idCurso) ON DELETE CASCADE
);

-- ATIVIDADE
CREATE TABLE atividadecomplementar (
  idAtividade INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(45),
  titulo VARCHAR(100),
  descricao VARCHAR(200),
  cargaHorariaSolicitada INT,
  aluno_matricula INT,
  regra_idRegra INT,
  FOREIGN KEY (aluno_matricula) REFERENCES aluno(matricula) ON DELETE CASCADE,
  FOREIGN KEY (regra_idRegra) REFERENCES regrasdocurso(idRegra) ON DELETE CASCADE
);

-- COORDENADOR
CREATE TABLE coordenador (
  idCoordenador INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  usuario_idusuario INT UNIQUE,
  telefone VARCHAR(16),
  email VARCHAR(60),
  FOREIGN KEY (usuario_idusuario) REFERENCES usuario(idusuario) ON DELETE CASCADE
);

-- SUBMISSAO
CREATE TABLE submissao (
  idSubmissao INT AUTO_INCREMENT PRIMARY KEY,
  atividade_idAtividade INT,
  coordenador_idCoordenador INT,
  dataEnvio DATETIME,
  status ENUM('pendente','aprovada','rejeitada') DEFAULT 'pendente',
  observacao TEXT,
  FOREIGN KEY (atividade_idAtividade) REFERENCES atividadecomplementar(idAtividade) ON DELETE CASCADE,
  FOREIGN KEY (coordenador_idCoordenador) REFERENCES coordenador(idCoordenador) ON DELETE CASCADE
);

-- CERTIFICADO
CREATE TABLE certificado (
  idCertificado INT AUTO_INCREMENT PRIMARY KEY,
  submissao_idSubmissao INT UNIQUE,
  nomeArquivo VARCHAR(150),
  caminhoArquivo VARCHAR(255),
  textoOCR TEXT,
  FOREIGN KEY (submissao_idSubmissao) REFERENCES submissao(idSubmissao) ON DELETE CASCADE
);

-- COORDENADOR_CURSO
CREATE TABLE coordenador_curso (
  coordenador_idCoordenador INT,
  curso_idCurso INT,
  PRIMARY KEY (coordenador_idCoordenador, curso_idCurso),
  FOREIGN KEY (coordenador_idCoordenador) REFERENCES coordenador(idCoordenador) ON DELETE CASCADE,
  FOREIGN KEY (curso_idCurso) REFERENCES curso(idCurso) ON DELETE CASCADE
);

-- NOTIFICACAO
CREATE TABLE notificacao_email (
  idNotificacao INT AUTO_INCREMENT PRIMARY KEY,
  submissao_idSubmissao INT,
  destinatario VARCHAR(120),
  assunto VARCHAR(150),
  corpo TEXT,
  dataEnvio DATETIME,
  FOREIGN KEY (submissao_idSubmissao) REFERENCES submissao(idSubmissao) ON DELETE CASCADE
);

-- SUPERADMIN
CREATE TABLE superadmin (
  idSuperAdmin INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120),
  usuario_idusuario INT UNIQUE,
  FOREIGN KEY (usuario_idusuario) REFERENCES usuario(idusuario) ON DELETE CASCADE
);