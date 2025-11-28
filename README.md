# Sistema de Inventário de Livros e Autores
Sistema de gerenciamento de biblioteca com API RESTful.

## Como Rodar o Projeto

### 1. Configure o Banco de Dados

Primeiro, você precisa criar o banco de dados e as tabelas. Execute o script SQL no MySQL:

```bash
mysql -u seu_usuario -p < backend/tabelas.sql
```

### 2. Configure o Backend

Entre na pasta do backend e instale as dependências:

```bash
cd backend
npm install
```

Depois, crie um arquivo `.env` na pasta `backend/` com as seguintes variáveis:

```env
PORT=3000
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=biblioteca
ACCESS_TOKEN_SECRET=seu_secret_jwt_aqui
REFRESH_TOKEN_SECRET=seu_refresh_secret_aqui
```

Substitua os valores pelas suas credenciais do MySQL e gere secrets aleatórios para os tokens JWT.

### 3. Inicie o Backend

Com o banco configurado, inicie o servidor:

```bash
npm run dev
```

O servidor vai rodar em `http://localhost:3000`.

### 4. Inicie o Frontend

Abra um novo terminal e entre na pasta do frontend:

```bash
cd frontend
npm install
npm run dev
```

O frontend vai rodar em `http://localhost:5173`.

## Como Usar

1. Abra o navegador e acesse a URL do frontend (geralmente `http://localhost:5173`)
2. Na tela de login, clique em "Registre-se" para criar uma conta
3. Preencha nome, email e senha e registre-se

Para criar um livro, você precisa primeiro ter pelo menos um autor cadastrado. Quando você cria um autor, ele aparece automaticamente no menu de seleção para criar um livro.

## Tecnologias Utilizadas

**Backend:**
- Node.js com Express
- MySQL para banco de dados
- JWT para autenticação
- bcrypt para hash de senhas

**Frontend:**
- React 19
- Vite 
- Axios