# 🎓 SpherEdu — Backend

Sistema desenvolvido como Projeto Integrador (PI) do SENAC, com foco na gestão de Atividades Complementares para instituições de ensino.

---

## 📌 Sobre o Projeto

O SpherEdu é uma API REST que serve de base para o sistema de gerenciamento de atividades complementares. Permite que alunos registrem atividades, coordenadores validem e administradores gerenciem todo o sistema.

---

## 🚀 Tecnologias Utilizadas

- Node.js + Express
- MySQL (hospedado no Clever Cloud)
- JWT (autenticação)
- bcrypt (hash de senhas)
- Resend (envio de e-mails)
- Cloudinary (armazenamento de certificados)
- Winston (logs em banco e console)
- Swagger (documentação da API)
- Deploy: Render

---

## 🧩 Funcionalidades

### 👨‍🎓 Aluno
- Cadastro com matrícula gerada automaticamente
- Matrícula em um ou mais cursos simultaneamente
- Envio de atividades complementares com certificado
- Acompanhamento do status das submissões
- Acúmulo de carga horária ao ter atividade aprovada

### 🧑‍🏫 Coordenador
- Visualização dos alunos vinculados aos seus cursos
- Aprovação ou rejeição de atividades com observação
- Notificação por e-mail ao aluno após avaliação

### 🛠️ SuperAdmin
- Gerenciamento completo de usuários, alunos, coordenadores e cursos
- Atribuição de cursos a alunos no cadastro ou edição
- Controle total sobre regras, atividades e permissões
- Acesso ao dashboard geral

---

## 🔐 Segurança

- Senhas armazenadas com hash via bcrypt
- Autenticação via JWT com expiração de 8h
- Proteção contra SQL Injection com queries parametrizadas
- Controle de acesso por perfil (superadmin, coordenador, aluno)

---

## 🗄️ Banco de Dados

MySQL com as seguintes tabelas principais:

- `usuario` — credenciais de acesso
- `aluno` — dados do aluno com matrícula única
- `coordenador` — dados do coordenador
- `curso` — cursos disponíveis
- `aluno_curso` — relação N:N entre aluno e curso
- `coordenador_curso` — relação N:N entre coordenador e curso
- `regrasdocurso` — regras de carga horária por categoria
- `atividadecomplementar` — atividades registradas pelos alunos
- `submissao` — submissões para avaliação
- `certificado` — certificados aprovados
- `notificacao_email` — histórico de e-mails enviados
- `log` — log de erros e eventos do sistema (retido por 30 dias)

---

## 📧 E-mail

O envio de e-mails utiliza a API do **Resend** (substitui SMTP que é bloqueado no Render free tier).

Variável necessária:
```
RESEND_API_KEY=re_xxxxxxxx
```

E-mails disparados automaticamente:
- Ao coordenador quando um aluno submete uma atividade
- Ao aluno quando a atividade é aprovada ou rejeitada

---

## ⚙️ Variáveis de Ambiente

```
DB_HOST=
DB_USER=
DB_PASS=
DB_NAME=
DB_PORT=
JWT_SECRET=
RESEND_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## 📁 Estrutura do Projeto

```
├── controllers/   — lógica de cada recurso
├── models/        — queries ao banco de dados
├── routes/        — definição dos endpoints
├── middlewares/   — autenticação e logs
├── config/        — configuração do banco
├── sql/           — schema do banco de dados
└── server.js      — entrada da aplicação
```

---

## 📚 Contexto Acadêmico

Projeto desenvolvido como parte do Projeto Integrador (PI) do SENAC — Análise e Desenvolvimento de Sistemas.

---

## 👨‍💻 Equipe

- Daniel Cabral
- Ian Gabriel
- Sabrina Beatriz
- Marcelo Lira
- Otávio Augusto

---

## 📌 Status

🚧 Em desenvolvimento / aprimoramento contínuo