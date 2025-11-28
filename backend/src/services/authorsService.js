const db = require("../database/connection");

// retorna todos autores
function listarAutores() {
  return new Promise((resolve, reject) => {
    db.query("SELECT id, nome FROM authors ORDER BY nome", (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// retorna autor por id
function pegarAutorPorId(id) {
  return new Promise((resolve, reject) => {
    db.query("SELECT id, nome FROM authors WHERE id = ?", [id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);
      resolve(results[0]);
    });
  });
}

// cria autor (retorna o objeto criado)
function criarAutor(nome) {
  return new Promise((resolve, reject) => {
    db.query("INSERT INTO authors (nome) VALUES (?)", [nome], (err, result) => {
      if (err) return reject(err);
      resolve({ id: result.insertId, nome });
    });
  });
}

// atualiza autor
function atualizarAutor(id, nome) {
  return new Promise((resolve, reject) => {
    db.query("UPDATE authors SET nome = ? WHERE id = ?", [nome, id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
}

// remove autor (verifica se tem livros associados)
async function removerAutor(id) {
  // Verifica se o autor existe
  const autor = await pegarAutorPorId(id);
  if (!autor) {
    return false;
  }

  // Verifica se há livros associados
  return new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) as count FROM books WHERE id_autor = ?", [id], (err, results) => {
      if (err) return reject(err);
      
      if (results[0].count > 0) {
        const error = new Error("Não é possível excluir autor com livros associados");
        error.status = 400;
        return reject(error);
      }

      db.query("DELETE FROM authors WHERE id = ?", [id], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  });
}

module.exports = {
  listarAutores,
  pegarAutorPorId,
  criarAutor,
  atualizarAutor,
  removerAutor
};
