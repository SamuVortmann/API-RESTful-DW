# 📚 Sistema de Inventário de Livros e Autores

Sistema de gerenciamento de biblioteca com API RESTful e interface web.

## 🚀 Como Rodar

### 1. Configure o Banco de Dados

Execute o script SQL:
```bash
mysql -u seu_usuario -p < backend/tabelas.sql
```

### 2. Configure o Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend/`:
```env
PORT=3000
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=biblioteca
ACCESS_TOKEN_SECRET=seu_secret_jwt_aqui
REFRESH_TOKEN_SECRET=seu_refresh_secret_aqui
```

### 3. Inicie o Backend

```bash
cd backend
npm run dev
```

O servidor estará em `http://localhost:3000`

### 4. Inicie o Frontend

Em outro terminal:
```bash
cd frontend
npm install
npm run dev
```

O frontend estará em `http://localhost:5173`

## 📖 Como Usar

1. Acesse o frontend no navegador
2. Registre uma nova conta ou faça login
3. Crie autores e livros através da interface

## 🔑 Endpoints Principais

- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Fazer login
- `GET /authors` - Listar autores
- `POST /authors` - Criar autor
- `GET /books` - Listar livros
- `POST /books` - Criar livro

Todas as rotas (exceto `/auth/*`) requerem autenticação via token JWT.

## 🛠️ Tecnologias

- **Backend**: Node.js, Express, MySQL, JWT
- **Frontend**: React, Vite, Axios
