const bookService = require("../services/booksService");

// GET - todos
async function pegarLivro(req, res) {
  const livros = await bookService.listarLivros();
  res.json(livros);
}

// GET - por id
async function pegarLivroId(req, res) {
  const id = req.params.id;
  const livro = await bookService.pegarLivroPorId(id);
  if (!livro) return res.status(404).json({ error: "Livro não encontrado" });
  res.json(livro);
}

// POST - criar
async function criarLivro(req, res, next) {
  try {
    const { titulo, id_autor, ano } = req.body;
    const novo = await bookService.criarLivro(titulo, id_autor, ano);
    res.status(201).json(novo);
  } catch (err) {
    next(err);
  }
}

// PUT - atualizar (aceita partial)
async function atualizarLivro(req, res, next) {
  try {
    const id = req.params.id;
    const campos = {};
    if (req.body.titulo !== undefined) campos.titulo = req.body.titulo;
    if (req.body.id_autor !== undefined) campos.id_autor = req.body.id_autor;
    if (req.body.ano !== undefined) campos.ano = req.body.ano;

    const ok = await bookService.atualizarLivro(id, campos);
    if (!ok) return res.status(404).json({ error: "Livro não encontrado ou sem alterações" });
    res.json({ message: "Atualizado com sucesso" });
  } catch (err) {
    next(err);
  }
}

// DELETE - remover
async function removerLivro(req, res) {
  const id = req.params.id;
  const ok = await bookService.removerLivro(id);
  if (!ok) return res.status(404).json({ error: "Livro não encontrado" });
  res.sendStatus(204);
}

module.exports = {
  pegarLivro,
  pegarLivroId,
  criarLivro,
  atualizarLivro,
  removerLivro
};
