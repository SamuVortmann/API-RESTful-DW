const db = require("../database/connection");

// listar todos os livros
function listarLivros() {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM books", (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// pegar por id
function pegarLivroPorId(id) {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM books WHERE id = ?", [id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);
      resolve(results[0]);
    });
  });
}

// verifica se autor existe
function verificarAutorExiste(id_autor) {
  return new Promise((resolve, reject) => {
    db.query("SELECT id FROM authors WHERE id = ?", [id_autor], (err, results) => {
      if (err) return reject(err);
      resolve(results.length > 0);
    });
  });
}

// cria livro (verifica autor)
async function criarLivro(titulo, id_autor, ano) {
  const autorExiste = await verificarAutorExiste(id_autor);
  if (!autorExiste) {
    throw "Autor não existe";
  }

  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO books (title, authorId, year) VALUES (?, ?, ?)",
      [titulo, id_autor, ano],
      (err, result) => {
        if (err) return reject(err);
        resolve({ id: result.insertId, titulo, id_autor, ano });
      }
    );
  });
}

// atualizar livro
function atualizarLivro(id, campos) {
  const sets = [];
  const values = [];

  if (campos.titulo !== undefined) {
    sets.push("title = ?");
    values.push(campos.titulo);
  }

  if (campos.id_autor !== undefined) {
    sets.push("authorId = ?");
    values.push(campos.id_autor);
  }

  if (campos.ano !== undefined) {
    sets.push("year = ?");
    values.push(campos.ano);
  }

  if (sets.length === 0) {
    return Promise.resolve(false);
  }

  values.push(id);

  const sql = `UPDATE books SET ${sets.join(", ")} WHERE id = ?`;

  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
}

function removerLivro(id) {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM books WHERE id = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
}

module.exports = {
  listarLivros,
  pegarLivroPorId,
  criarLivro,
  atualizarLivro,
  removerLivro,
  verificarAutorExiste
};
