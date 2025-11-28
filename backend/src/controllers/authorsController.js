const authorService = require("../services/authorsService");

// GET - todos autores
async function pegarAutor(req, res) {
  const autores = await authorService.listarAutores();
  res.json(autores);
}

// GET - por id
async function pegarAutorId(req, res) {
  const id = req.params.id;
  const autor = await authorService.pegarAutorPorId(id);
  if (!autor) return res.status(404).json({ error: "Autor não encontrado" });
  res.json(autor);
}

// POST - criar
async function criarAutor(req, res) {
  const { nome } = req.body;
  const novo = await authorService.criarAutor(nome);
  res.status(201).json(novo);
}

// PUT - atualizar
async function atualizarAutor(req, res) {
  const id = req.params.id;
  const { nome } = req.body;
  const ok = await authorService.atualizarAutor(id, nome);
  if (!ok) return res.status(404).json({ error: "Autor não encontrado" });
  res.json({ message: "Atualizado com sucesso" });
}

// DELETE - remover
async function removerAutor(req, res) {
  const id = req.params.id;
  const ok = await authorService.removerAutor(id);
  if (!ok) return res.status(404).json({ error: "Autor não encontrado" });
  res.sendStatus(204);
}

module.exports = {
  pegarAutor,
  pegarAutorId,
  criarAutor,
  atualizarAutor,
  removerAutor
};
